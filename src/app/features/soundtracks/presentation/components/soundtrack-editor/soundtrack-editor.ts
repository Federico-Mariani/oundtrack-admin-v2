import { SoundtrackFileSelection } from '../../uploads/soundtrack-file-selection';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { soundtracksTranslationsLoader } from '../../i18n/soundtracks-translations.loader';
import { disabled, form } from '@angular/forms/signals';
import { TextInput } from '@shared/ui/text-input/text-input';
import { CheckboxChoice } from '@shared/ui/checkbox-choice/checkbox-choice';
import { FormSection } from '@shared/ui/form-section/form-section';
import { FileDropzone } from '@shared/ui/file-dropzone/file-dropzone';
import { FileAttachment } from '@shared/ui/file-attachment/file-attachment';
import { FileAttachmentState } from '@shared/ui/file-attachment/file-attachment-state';
import { UploadProgress } from '@shared/ui/upload-progress/upload-progress';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { LANGUAGE_OPTIONS } from '@app/core/i18n/language/language-options';
import { toSupportedLocale } from '@app/core/i18n/language/language-locale.mapper';
import { NotificationService } from '@app/core/notifications/notification.service';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { Button } from '@shared/ui/button/button';
import type { SoundtrackEditorParams } from './soundtrack-editor-params';
import { SoundtracksFacade } from '../../../application/state/facades/soundtracks.facade';
import { SoundtrackEditorMode } from '../../../application/workflows/soundtrack-editor.mode';
import { SoundtrackEditorPhase } from '../../../application/workflows/soundtrack-editor.phase';

@Component({
  selector: 'app-soundtrack-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ModalFrame,
    Button,
    TextInput,
    CheckboxChoice,
    FormSection,
    FileDropzone,
    FileAttachment,
    UploadProgress,
  ],
  providers: [
    SoundtrackFileSelection,
    provideTranslocoScope({ scope: 'soundtracks', loader: soundtracksTranslationsLoader }),
  ],
  templateUrl: './soundtrack-editor.html',
})
export class SoundtrackEditor implements ModalContent<SoundtrackEditorParams, boolean> {
  readonly params = injectBrnDialogContext<{ params: SoundtrackEditorParams }>().params;
  readonly ref = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly facade = inject(SoundtracksFacade);
  protected readonly selection = inject(SoundtrackFileSelection);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sessionId = crypto.randomUUID();
  protected readonly modes = SoundtrackEditorMode;
  protected readonly phases = SoundtrackEditorPhase;
  protected readonly state = this.facade.data.audio;
  protected readonly busy = this.facade.requests.audio.isLoading;
  protected readonly error = this.facade.requests.audio.error;
  private readonly externalModel = signal({ externalId: this.params.track?.externalId ?? '' });
  protected readonly externalId = computed(() => this.externalModel().externalId);
  protected readonly languages = signal<Array<SupportedLocale>>([]);
  protected readonly externalErrors = signal<ReadonlyArray<string>>([]);
  protected readonly languageErrors = signal<ReadonlyArray<string>>([]);
  protected readonly submitted = signal(false);
  protected readonly hasChanges = computed(
    () =>
      (!!this.state().track && this.state().track?.id !== this.params.track?.id) ||
      this.state().uploaded ||
      this.state().creationUncertain ||
      this.state().phase === SoundtrackEditorPhase.Done,
  );
  protected readonly metadataLocked = computed(
    () =>
      this.busy() || (this.params.mode !== SoundtrackEditorMode.Languages && !!this.state().track),
  );
  protected readonly externalForm = form(this.externalModel, (path) => {
    disabled(path.externalId, { when: () => this.metadataLocked() });
  });
  protected readonly externalMessages = computed(() =>
    this.submitted() && !this.externalId().trim()
      ? [this.transloco.translate('soundtracks.audio.required')]
      : this.externalErrors(),
  );
  protected readonly attachmentState = computed(() =>
    this.busy()
      ? this.state().phase === SoundtrackEditorPhase.Uploading
        ? FileAttachmentState.Uploading
        : FileAttachmentState.Processing
      : this.state().uploaded
        ? FileAttachmentState.Done
        : FileAttachmentState.Idle,
  );
  protected readonly languageOnly = this.params.mode === SoundtrackEditorMode.Languages;
  protected readonly uploadOnly = this.params.mode === SoundtrackEditorMode.Upload;
  protected readonly options = LANGUAGE_OPTIONS.map((option) => {
    const value = toSupportedLocale(option.code);
    return {
      value,
      label: option.label,
      occupied: !!this.params.soundtrack?.tracks.some(
        (track) => track.id !== this.params.track?.id && track.languages.includes(value),
      ),
    };
  });
  protected readonly occupiedLanguageNames = this.options
    .filter((option) => option.occupied)
    .map((option) => option.label)
    .join(', ');
  protected readonly available = this.options.filter((option) => !option.occupied);
  protected readonly allSelected = computed(
    () =>
      this.available.length > 0 &&
      this.available.every((option) => this.languages().includes(option.value)),
  );
  protected readonly canSubmit = computed(
    () =>
      !this.busy() &&
      !this.selection.checkingFile() &&
      !this.state().creationUncertain &&
      (this.languageOnly || this.state().uploaded || !!this.selection.fileName()),
  );
  constructor() {
    effect(() => {
      this.externalId();
      untracked(() => {
        this.externalErrors.set([]);
      });
    });
    this.facade.actions.openAudio(
      this.sessionId,
      this.params.soundtrack?.id ?? null,
      this.params.track ?? null,
    );
    this.languages.set(
      this.params.track
        ? [...this.params.track.languages]
        : this.available.some((option) => option.value === this.params.locale)
          ? [this.params.locale]
          : this.available.slice(0, 1).map((option) => option.value),
    );
    effect(() => {
      if (this.facade.requests.audio.isSuccess()) {
        untracked(() => {
          this.notifications.success(
            this.transloco.translate('soundtracks.audio.success.' + this.params.mode),
          );
          this.ref.close(true);
        });
      }
    });
    effect(() => {
      const error = this.error();
      this.externalErrors.set(
        error?.fieldErrors?.['trackExternalId'] ?? error?.fieldErrors?.['externalId'] ?? [],
      );
      this.languageErrors.set(error?.fieldErrors?.['languages'] ?? []);
      if (error) {
        untracked(() => {
          this.notifications.error(
            this.transloco.translate('soundtracks.audio.errors.' + error.code),
          );
        });
      }
    });
    this.destroyRef.onDestroy(() => {
      this.facade.actions.closeAudio(this.sessionId);
    });
  }
  protected toggleLanguage(locale: SupportedLocale): void {
    if (this.metadataLocked() || !this.available.some((option) => option.value === locale)) {
      return;
    }
    this.languageErrors.set([]);
    this.languages.update((values) =>
      values.includes(locale) ? values.filter((value) => value !== locale) : [...values, locale],
    );
  }
  protected selectAll(): void {
    if (!this.metadataLocked()) {
      this.languageErrors.set([]);
      this.languages.set(this.allSelected() ? [] : this.available.map((option) => option.value));
    }
  }
  protected removeFile(): void {
    if (!this.busy() && !this.state().uploaded) {
      this.selection.remove();
    }
  }
  protected async chooseFile(file: File): Promise<void> {
    if (!this.busy() && !this.state().uploaded) {
      await this.selection.choose(file);
    }
  }
  protected restartUpload(): void {
    this.facade.actions.restartAudioUpload(this.sessionId);
  }
  protected cancelUpload(): void {
    this.facade.actions.cancelAudio(this.sessionId);
  }
  protected submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    if (
      !this.canSubmit() ||
      (!this.state().track && !this.externalId().trim()) ||
      !this.languages().length
    ) {
      return;
    }
    this.facade.actions.saveAudio(this.sessionId, {
      mode: this.params.mode,
      owner: this.params.owner,
      soundtrackId: this.params.soundtrack?.id ?? null,
      externalId: this.externalId().trim(),
      languages: this.languages(),
      fileKey: this.selection.fileKey,
    });
  }
}
