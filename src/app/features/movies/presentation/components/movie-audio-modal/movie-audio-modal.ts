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
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { LANGUAGE_OPTIONS } from '@app/core/i18n/language/language-options';
import { toSupportedLocale } from '@app/core/i18n/language/language-locale.mapper';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { isMp3File } from '@app/core/uploads/mp3-file-validation';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { Button } from '@shared/ui/button/button';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { MovieAudioMode } from '../../../domain/models/movie-audio-mode.model';
import { MovieAudioPhase } from '../../../domain/models/movie-audio-phase.model';
import type { MovieAudioModalParams } from './movie-audio-modal-params';

@Component({
  selector: 'app-movie-audio-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, Button],
  templateUrl: './movie-audio-modal.html',
})
export class MovieAudioModal implements ModalContent<MovieAudioModalParams, boolean> {
  readonly params = injectBrnDialogContext<{ params: MovieAudioModalParams }>().params;
  readonly ref = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly facade = inject(MoviesFacade);
  private readonly files = inject(UploadFiles);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sessionId = crypto.randomUUID();
  private fileKey: string | null = null;
  private selectionGeneration = 0;
  protected readonly modes = MovieAudioMode;
  protected readonly phases = MovieAudioPhase;
  protected readonly state = this.facade.data.audio;
  protected readonly busy = this.facade.requests.audio.isLoading;
  protected readonly error = this.facade.requests.audio.error;
  protected readonly externalId = signal(this.params.track?.externalId ?? '');
  protected readonly languages = signal<Array<SupportedLocale>>([]);
  protected readonly fileName = signal('');
  protected readonly fileSize = signal('');
  protected readonly fileInvalid = signal(false);
  protected readonly checkingFile = signal(false);
  protected readonly externalErrors = signal<ReadonlyArray<string>>([]);
  protected readonly languageErrors = signal<ReadonlyArray<string>>([]);
  protected readonly submitted = signal(false);
  protected readonly metadataLocked = computed(
    () => this.busy() || (this.params.mode !== MovieAudioMode.Languages && !!this.state().track),
  );
  protected readonly languageOnly = this.params.mode === MovieAudioMode.Languages;
  protected readonly uploadOnly = this.params.mode === MovieAudioMode.Upload;
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
  protected readonly available = this.options.filter((option) => !option.occupied);
  protected readonly allSelected = computed(
    () =>
      this.available.length > 0 &&
      this.available.every((option) => this.languages().includes(option.value)),
  );
  protected readonly canSubmit = computed(
    () =>
      !this.busy() &&
      !this.checkingFile() &&
      !this.state().creationUncertain &&
      (this.languageOnly || this.state().uploaded || !!this.fileName()),
  );
  constructor() {
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
            this.transloco.translate('movies.audio.success.' + this.params.mode),
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
          this.notifications.error(this.transloco.translate('movies.audio.errors.' + error.code));
        });
      }
    });
    this.destroyRef.onDestroy(() => {
      this.selectionGeneration++;
      this.facade.actions.closeAudio(this.sessionId);
      if (this.fileKey) {
        this.files.release(this.fileKey);
      }
    });
  }
  protected changeExternalId(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.externalId.set(event.target.value);
      this.externalErrors.set([]);
    }
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
  protected async chooseFile(event: Event): Promise<void> {
    if (!(event.target instanceof HTMLInputElement) || this.busy() || this.state().uploaded) {
      return;
    }
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const generation = ++this.selectionGeneration;
    if (this.fileKey) {
      this.files.release(this.fileKey);
      this.fileKey = null;
    }
    this.fileName.set('');
    this.fileInvalid.set(false);
    this.checkingFile.set(true);
    let valid: boolean;
    try {
      valid = await isMp3File(file);
    } catch {
      valid = false;
    }
    if (generation !== this.selectionGeneration || this.destroyRef.destroyed) {
      return;
    }
    this.checkingFile.set(false);
    this.fileInvalid.set(!valid);
    if (valid) {
      this.fileKey = this.files.register(file);
      this.fileName.set(file.name);
      this.fileSize.set((file.size / 1024 / 1024).toFixed(2));
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
      movieId: this.params.movieId,
      soundtrackId: this.params.soundtrack?.id ?? null,
      externalId: this.externalId().trim(),
      languages: this.languages(),
      fileKey: this.fileKey,
    });
  }
}
