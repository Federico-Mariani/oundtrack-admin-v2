import { HINT_COSTS } from '../../../domain/values/hint-cost';
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
import { isSupportedLocale, SUPPORTED_LOCALES } from '@shared/localization/supported-locale';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { Button } from '@shared/ui/button/button';
import { Select } from '@shared/ui/select/select';
import { Textarea } from '@shared/ui/textarea/textarea';
@Component({
  selector: 'app-hint-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, Button, Select, Textarea],
  providers: [provideTranslocoScope({ scope: 'hints', loader: hintsTranslationsLoader })],
  templateUrl: './hint-editor.html',
})
export class HintEditor implements ModalContent<HintEditorParams, boolean> {
  readonly params = injectBrnDialogContext<{ params: HintEditorParams }>().params;
  readonly ref = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly facade = inject(HintsFacade);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
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
  private readonly values = signal({
    text: this.params.hint?.info.find((info) => info.language === this.locale())?.text ?? '',
  });
  protected readonly fields = form(this.values, (path) => {
    disabled(path, { when: () => this.busy() });
  });
  protected typeItems(): Array<SelectItem> {
    return this.params.availableTypes.map((value) => ({
      value,
      label: this.transloco.translate('hints.editor.types.' + value),
    }));
  }
  protected languageItems(): Array<SelectItem> {
    return this.languages.map((value) => ({
      value,
      label: this.transloco.translate('hints.editor.languages.' + value),
    }));
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
    const key =
      this.params.mode === HintEditorMode.Edit && (error?.status === 404 || error?.status === 405)
        ? 'editUnavailable'
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
    if (!this.busy() && isHintType(value) && this.params.availableTypes.includes(value))
      this.type.set(value);
  }
  protected changeLanguage(value: string): void {
    if (this.busy() || !isSupportedLocale(value) || !this.languages.includes(value)) return;
    this.locale.set(value);
    if (this.params.mode === HintEditorMode.Edit)
      this.values.update((values) => ({
        ...values,
        text: this.params.hint?.info.find((info) => info.language === value)?.text ?? '',
      }));
  }
  protected submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    if (this.busy()) return;
    const mode = this.params.mode,
      hint = this.params.hint,
      language = this.locale(),
      type = this.type();
    let command: SaveHintCommand;
    if (mode === HintEditorMode.Delete && hint)
      command = { mode, owner: this.params.owner, hintId: hint.id };
    else {
      if (!language || !this.values().text.trim()) return;
      const content = { owner: this.params.owner, language, text: this.values().text.trim() };
      if (mode === HintEditorMode.Translate && hint)
        command = { ...content, mode, hintId: hint.id };
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
