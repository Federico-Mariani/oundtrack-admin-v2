import { HintSavePhase } from '../../../application/workflows/hint-save.phase';
import { HintImageSelection } from '../../uploads/hint-image-selection';
import { HintImageField } from '../hint-image-field/hint-image-field';
import { isImageHint } from '../../../domain/values/hint-image-policy';
import { UploadProgress } from '@shared/ui/upload-progress/upload-progress';
import { HINT_COSTS } from '../../../domain/values/hint-cost';
import { CheckboxChoice } from '@shared/ui/checkbox-choice/checkbox-choice';
import type { SelectItem } from '@shared/interfaces/select-item';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { disabled, form } from '@angular/forms/signals';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { hintsTranslationsLoader } from '../../i18n/hints-translations.loader';
import { HintEditorMode } from '../../../application/workflows/hint-editor.mode';
import { HintsFacade } from '../../../application/state/facades/hints.facade';
import type { SaveHintCommand } from '../../../application/commands/save-hint.command';
import { isHintType } from '../../../domain/values/hint-type';
import type { HintEditorParams } from './hint-editor-params';
import { NotificationService } from '@app/core/notifications/notification.service';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { type SupportedLocale, SUPPORTED_LOCALES } from '@shared/localization/supported-locale';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { Button } from '@shared/ui/button/button';
import { Select } from '@shared/ui/select/select';
import { Textarea } from '@shared/ui/textarea/textarea';
@Component({
  selector: 'app-hint-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ModalFrame,
    Button,
    Select,
    CheckboxChoice,
    Textarea,
    HintImageField,
    UploadProgress,
  ],
  providers: [
    HintImageSelection,
    provideTranslocoScope({ scope: 'hints', loader: hintsTranslationsLoader }),
  ],
  templateUrl: './hint-editor.html',
})
export class HintEditor implements ModalContent<HintEditorParams, boolean> {
  readonly params = injectBrnDialogContext<{ params: HintEditorParams }>().params;
  readonly ref = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly facade = inject(HintsFacade);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  protected readonly selection = inject(HintImageSelection);
  protected readonly phase = this.facade.data.phase;
  protected readonly progress = this.facade.data.progress;
  protected readonly preparedHint = this.facade.data.preparedHint;
  protected readonly uncertain = this.facade.data.creationUncertain;
  protected readonly metadataLocked = computed(
    () => this.busy() || !!this.preparedHint() || this.uncertain(),
  );
  protected readonly visual = computed(() => isImageHint(this.type()));
  protected readonly existingImage = computed(
    () => this.params.hint?.info.find((info) => info.image)?.image ?? null,
  );
  protected readonly imageRequired = computed(
    () => this.visual() && !(this.params.mode === HintEditorMode.Translate && this.existingImage()),
  );
  protected readonly modes = HintEditorMode;
  protected readonly busy = this.facade.requests.save.isLoading;
  protected readonly error = this.facade.requests.save.error;
  private readonly requestId = signal<string | null>(null);
  protected readonly submitted = signal(false);
  protected readonly type = signal(this.params.hint?.type ?? this.params.availableTypes.at(0));
  protected readonly languages = SUPPORTED_LOCALES.filter((locale) =>
    this.params.mode === HintEditorMode.Translate
      ? !this.params.hint?.info.some((info) => info.language === locale)
      : this.params.mode === HintEditorMode.Edit
        ? this.params.hint?.info.some((info) => info.language === locale)
        : true,
  );
  protected readonly locale = signal(
    this.languages.includes(this.params.locale) ? this.params.locale : this.languages.at(0),
  );
  protected readonly selectedLanguages = signal<ReadonlyArray<SupportedLocale>>([
    this.locale() ?? SUPPORTED_LOCALES[0],
  ]);
  protected readonly allSelected = computed(() =>
    this.languages.every((language) => this.selectedLanguages().includes(language)),
  );
  private readonly values = signal({
    text: this.params.hint?.info.find((info) => info.language === this.locale())?.text ?? '',
  });
  protected readonly fields = form(this.values, (path) => {
    disabled(path, { when: () => this.metadataLocked() });
  });
  protected typeItems(): Array<SelectItem> {
    return this.params.availableTypes.map((value) => ({
      value,
      label: this.transloco.translate('hints.editor.types.' + value),
    }));
  }
  protected toggleLanguage(language: SupportedLocale): void {
    if (this.metadataLocked() || !this.languages.includes(language)) return;
    this.selectedLanguages.update((selected) =>
      selected.includes(language)
        ? selected.filter((item) => item !== language)
        : [...selected, language],
    );
  }
  protected selectAllLanguages(): void {
    if (!this.metadataLocked())
      this.selectedLanguages.set(this.allSelected() ? [] : [...this.languages]);
  }
  protected readonly textErrors = computed(() =>
    this.submitted() && !this.values().text.trim()
      ? [this.transloco.translate('hints.editor.required')]
      : (this.error()?.fieldErrors?.['text'] ?? []),
  );
  protected readonly cost = computed(() => {
    const type = this.type();
    return type ? HINT_COSTS[type] : null;
  });
  protected readonly errorMessage = computed(() => {
    const error = this.error();
    const key = this.uncertain()
      ? 'image.uncertain'
      : this.phase() === HintSavePhase.Localizing
        ? 'localizationFailed'
        : this.phase() === HintSavePhase.Confirming
          ? 'image.confirmFailed'
          : this.phase() === HintSavePhase.Uploading
            ? 'image.uploadFailed'
            : error?.code === RequestErrorCode.Conflict
              ? 'conflict'
              : 'failed';
    return this.transloco.translate('hints.editor.' + key);
  });
  constructor() {
    this.facade.actions.resetSave();
    effect(() => {
      if (!this.requestId() || this.facade.data.saveId() !== this.requestId()) return;
      if (this.facade.requests.save.isSuccess())
        untracked(() => {
          this.notifications.success(
            this.transloco.translate(
              'hints.editor.' +
                (this.params.mode === HintEditorMode.Delete ? 'deleted' : 'success'),
            ),
          );
          this.ref.close(true);
        });
      else if (this.error())
        untracked(() => {
          this.notifications.error(this.errorMessage());
        });
    });
  }
  protected changeType(value: string): void {
    if (!this.metadataLocked() && isHintType(value) && this.params.availableTypes.includes(value)) {
      if (this.type() !== value) this.selection.remove();
      this.type.set(value);
      this.submitted.set(false);
    }
  }
  protected submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    if (
      this.busy() ||
      this.selection.checking() ||
      this.selection.invalid() ||
      this.selection.multiple() ||
      this.uncertain()
    )
      return;
    const mode = this.params.mode,
      hint = this.params.hint,
      languages = this.visual() ? SUPPORTED_LOCALES : this.selectedLanguages(),
      language = languages.at(0),
      type = this.type();
    let command: SaveHintCommand;
    if (mode === HintEditorMode.Delete && hint)
      command = { mode, owner: this.params.owner, hintId: hint.id };
    else {
      if (
        !language ||
        (!this.visual() && !this.values().text.trim()) ||
        (this.imageRequired() && !this.selection.fileKey())
      )
        return;
      const content = {
        owner: this.params.owner,
        language,
        languages,
        ...(!this.visual() ? { text: this.values().text.trim() } : {}),
        ...(this.visual() && this.selection.fileKey()
          ? { fileKey: this.selection.fileKey() ?? undefined }
          : {}),
      };
      if (mode === HintEditorMode.Translate && hint)
        command = { ...content, mode, hintId: hint.id };
      else if (mode === HintEditorMode.Edit && hint && this.visual() && this.selection.fileKey())
        command = {
          mode: HintEditorMode.Image,
          owner: this.params.owner,
          hintId: hint.id,
          type: hint.type,
          languages,
          fileKey: this.selection.fileKey() ?? '',
        };
      else if (mode === HintEditorMode.Edit && hint)
        command = {
          ...content,
          mode,
          hintId: hint.id,
          type: hint.type,
        };
      else if (mode === HintEditorMode.Create && type) command = { ...content, mode, type };
      else return;
    }
    const requestId = crypto.randomUUID();
    this.requestId.set(requestId);
    this.facade.actions.save(this.params.sessionId, requestId, command);
  }
}
