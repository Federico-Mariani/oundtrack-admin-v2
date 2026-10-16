import { LANGUAGE_OPTIONS } from '@app/core/i18n/language/language-options';
import { toSupportedLocale } from '@app/core/i18n/language/language-locale.mapper';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideRefreshCw } from '@ng-icons/lucide';
import { ModalService } from '@shared/ui/modal/modal.service';
import { CreateMovieInfoModal } from '../create-movie-info-modal/create-movie-info-modal';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { resolveLocalized } from '@shared/localization/localized.queries';
import type { Localized } from '@shared/localization/localized';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { Select } from '@shared/ui/select/select';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '@app/core/notifications/notification.service';
import { HlmContextMenuTrigger } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenu, HlmDropdownMenuItem } from '@spartan-ng/helm/dropdown-menu';
import { Button } from '@shared/ui/button/button';
import { MovieDetailSkeleton } from '../movie-detail-skeleton/movie-detail-skeleton';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { MovieDetailImage } from '../movie-detail-image/movie-detail-image';
import { MovieTrackPlayer } from '../movie-track-player/movie-track-player';
import type { MovieSoundtrackTrackModel } from '../../../domain/models/movie-soundtrack-track.model';
import type { MovieDetailModalParams } from './movie-detail-modal-params';

@Component({
  selector: 'app-movie-detail-modal',
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
    MovieDetailSkeleton,
    MovieDetailImage,
    MovieTrackPlayer,
  ],
  providers: [provideIcons({ lucidePlus, lucideRefreshCw })],
  templateUrl: './movie-detail-modal.html',
})
export class MovieDetailModal implements ModalContent<MovieDetailModalParams, void> {
  readonly params = injectBrnDialogContext<{ params: MovieDetailModalParams }>().params;
  readonly ref = inject<BrnDialogRef<void>>(BrnDialogRef);
  private readonly clipboard = inject(Clipboard);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  protected copyId(id: string): void {
    if (this.clipboard.copy(id)) {
      this.notifications.success(this.transloco.translate('movies.catalog.copied'));
    } else {
      this.notifications.error(this.transloco.translate('movies.catalog.copyFailed'));
    }
  }
  private readonly facade = inject(MoviesFacade);
  private readonly language = inject(LanguageService);
  private readonly selectedLocale = signal<SupportedLocale | null>(null);
  private readonly modals = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private createInfoRef?: BrnDialogRef<SupportedLocale>;
  protected readonly missingLanguages = computed(() =>
    LANGUAGE_OPTIONS.map((option) => toSupportedLocale(option.code)).filter(
      (locale) => !this.locales().includes(locale),
    ),
  );
  private playingAudio?: HTMLAudioElement;
  protected readonly loading = this.facade.loadingStatuses.isLoadingDetail;
  protected readonly error = this.facade.errorStatuses.detail;
  protected readonly movie = computed(() => {
    const movie = this.facade.data.detail();
    return movie?.id === this.params.id ? movie : null;
  });
  protected readonly locales = computed(() => {
    const info = this.movie()?.info;
    return (['it-IT', 'en-US'] as const).filter((locale) => info?.[locale]);
  });
  protected readonly languageItems = computed(() =>
    this.locales().map((value) => ({ value, label: value === 'it-IT' ? 'Italiano' : 'English' })),
  );
  protected readonly locale = computed(() => {
    const preferred = this.selectedLocale() ?? this.language.activeLocale();
    return this.locales().includes(preferred) ? preferred : (this.locales()[0] ?? preferred);
  });
  protected readonly info = computed(() => {
    const movie = this.movie();
    return movie ? resolveLocalized(movie.info, this.locale()) : undefined;
  });
  constructor() {
    this.reload();
    inject(DestroyRef).onDestroy(() => {
      this.playingAudio?.pause();
      this.facade.actions.closeDetail(this.params.id);
    });
  }
  protected addLanguage(): void {
    if (this.createInfoRef || !this.missingLanguages().length || this.loading() || this.error()) {
      return;
    }
    this.playingAudio?.pause();
    this.createInfoRef = this.modals.open(
      CreateMovieInfoModal,
      { id: this.params.id, languages: this.missingLanguages() },
      { viewContainerRef: this.viewContainerRef, disableClose: true },
    );
    this.createInfoRef.closed$.subscribe((language) => {
      this.createInfoRef = undefined;
      if (language) {
        this.selectedLocale.set(language);
        this.reload();
      }
    });
  }
  protected reload(): void {
    this.playingAudio?.pause();
    this.facade.actions.loadDetail(this.params.id);
  }
  protected changeLocale(value: string): void {
    if (value === 'it-IT' || value === 'en-US') {
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
    tracks: ReadonlyArray<MovieSoundtrackTrackModel>,
  ): ReadonlyArray<MovieSoundtrackTrackModel> {
    return tracks.filter((track) => track.languages.includes(this.locale()));
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
