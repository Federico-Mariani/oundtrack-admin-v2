import { SoundtrackPlayer } from './soundtrack-player/soundtrack-player';
import type { CatalogDetailViewModel } from './catalog-detail.view-model';
import type { RequestError } from '@shared/state/request/request-error';
import {
  type SupportedLocale,
  isSupportedLocale,
  SUPPORTED_LOCALES,
} from '@shared/localization/supported-locale';
import {
  type SoundtrackOwner,
  loadSoundtrackEditor,
  SoundtrackEditorMode,
} from '@features/soundtracks';
import type { SoundtrackModel } from '@shared/types/catalog/soundtrack.model';
import { LANGUAGE_OPTIONS } from '@app/core/i18n/language/language-options';
import { toSupportedLocale } from '@app/core/i18n/language/language-locale.mapper';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideRefreshCw } from '@ng-icons/lucide';
import { ModalService } from '@shared/ui/modal/modal.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  input,
  model,
  output,
  ViewContainerRef,
} from '@angular/core';
import type { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { resolveLocalized } from '@shared/localization/localized.queries';
import type { Localized } from '@shared/localization/localized';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import { Select } from '@shared/ui/select/select';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '@app/core/notifications/notification.service';
import { HlmContextMenuTrigger } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenu, HlmDropdownMenuItem } from '@spartan-ng/helm/dropdown-menu';
import { Button } from '@shared/ui/button/button';
import { MediaDetailSkeleton } from '@shared/ui/media-detail-skeleton/media-detail-skeleton';
import { MediaImage } from '@shared/ui/media-image/media-image';
import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';

@Component({
  selector: 'app-catalog-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ModalFrame,
    Button,
    Select,
    IconButton,
    HlmContextMenuTrigger,
    HlmDropdownMenu,
    HlmDropdownMenuItem,
    MediaDetailSkeleton,
    MediaImage,
    SoundtrackPlayer,
  ],
  providers: [provideIcons({ lucidePlus, lucideRefreshCw })],
  templateUrl: './catalog-detail.html',
})
export class CatalogDetail {
  readonly detail = input<CatalogDetailViewModel | null>(null);
  readonly owner = input.required<SoundtrackOwner>();
  readonly translationScope = input.required<string>();
  readonly loading = input(false);
  readonly error = input<RequestError | null>(null);
  readonly selectedLocale = model<SupportedLocale | null>(null);
  readonly refresh = output();
  readonly createTranslation = output<ReadonlyArray<SupportedLocale>>();
  private readonly clipboard = inject(Clipboard);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  protected copyId(id: string): void {
    if (this.clipboard.copy(id)) {
      this.notifications.success(
        this.transloco.translate(this.translationScope() + '.catalog.copied'),
      );
    } else {
      this.notifications.error(
        this.transloco.translate(this.translationScope() + '.catalog.copyFailed'),
      );
    }
  }
  private readonly language = inject(LanguageService);
  private readonly modals = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly audioModes = SoundtrackEditorMode;
  protected readonly showAllTracks = signal(false);
  private readonly destroyRef = inject(DestroyRef);
  private openingAudio = false;
  private audioRef?: BrnDialogRef<boolean>;
  protected async manageAudio(
    mode: SoundtrackEditorMode,
    soundtrack?: SoundtrackModel,
    track?: SoundtrackTrackModel,
  ): Promise<void> {
    if (this.audioRef || this.openingAudio || this.loading()) {
      return;
    }
    this.playingAudio?.pause();
    this.openingAudio = true;
    let editor: Awaited<ReturnType<typeof loadSoundtrackEditor>>;
    try {
      editor = await loadSoundtrackEditor();
    } catch {
      this.notifications.error(
        this.transloco.translate(this.translationScope() + '.detail.failed'),
      );
      return;
    } finally {
      this.openingAudio = false;
    }
    if (this.destroyRef.destroyed) {
      return;
    }
    this.audioRef = this.modals.open(
      editor,
      { mode, owner: this.owner(), locale: this.locale(), soundtrack, track },
      {
        viewContainerRef: this.viewContainerRef,
        disableClose: true,
        contentClass: 'w-[min(36rem,calc(100vw-2rem))] max-w-none p-6 sm:p-8',
      },
    );
    this.audioRef.closed$.subscribe((changed) => {
      this.audioRef = undefined;
      if (changed) {
        this.showAllTracks.set(true);
        this.reload();
      }
    });
  }
  protected readonly missingLanguages = computed(() =>
    LANGUAGE_OPTIONS.map((option) => toSupportedLocale(option.code)).filter(
      (locale) => !this.locales().includes(locale),
    ),
  );
  private playingAudio?: HTMLAudioElement;
  protected readonly locales = computed(() => {
    const info = this.detail()?.info;
    return SUPPORTED_LOCALES.filter((locale) => info?.[locale]);
  });
  protected readonly languageItems = computed(() =>
    LANGUAGE_OPTIONS.map((option) => ({
      value: toSupportedLocale(option.code),
      label: option.label,
    })).filter((option) => this.locales().includes(option.value)),
  );
  protected readonly locale = computed(() => {
    const preferred = this.selectedLocale() ?? this.language.activeLocale();
    return this.locales().includes(preferred) ? preferred : (this.locales()[0] ?? preferred);
  });
  protected readonly info = computed(() => {
    const detail = this.detail();
    return detail ? resolveLocalized(detail.info, this.locale()) : undefined;
  });
  constructor() {
    inject(DestroyRef).onDestroy(() => this.playingAudio?.pause());
  }
  protected addLanguage(): void {
    if (!this.missingLanguages().length || this.loading() || this.error()) {
      return;
    }
    this.playingAudio?.pause();
    this.createTranslation.emit(this.missingLanguages());
  }
  protected reload(): void {
    this.playingAudio?.pause();
    this.refresh.emit();
  }
  protected changeLocale(value: string): void {
    if (isSupportedLocale(value)) {
      this.playingAudio?.pause();
      this.selectedLocale.set(value);
    }
  }
  protected localizedName(info: Localized<{ readonly name: string }>): string {
    return resolveLocalized(info, this.locale())?.name ?? '—';
  }
  protected formatDate(value: number | undefined): string {
    return value !== undefined && Number.isFinite(new Date(value).getTime())
      ? new Intl.DateTimeFormat(this.language.activeLocale(), {
          dateStyle: 'medium',
          timeZone: 'UTC',
        }).format(value)
      : '—';
  }
  protected localizedTracks(
    tracks: ReadonlyArray<SoundtrackTrackModel>,
  ): ReadonlyArray<SoundtrackTrackModel> {
    return this.showAllTracks()
      ? tracks
      : tracks.filter((track) => track.languages.includes(this.locale()));
  }
  protected formatTimestamp(value: number): string {
    return Number.isFinite(new Date(value).getTime())
      ? new Intl.DateTimeFormat(this.language.activeLocale(), {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(value)
      : '—';
  }
  protected play(audio: HTMLAudioElement): void {
    if (this.playingAudio !== audio) {
      this.playingAudio?.pause();
    }
    this.playingAudio = audio;
  }
}
