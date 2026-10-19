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
import type { TvSeriesDetailModalParams } from './tv-series-detail-modal-params';
import { TvSeriesFacade } from '../../../application/state/facades/tv-series.facade';
import { TvSeriesAudioModal } from '../tv-series-audio-modal/tv-series-audio-modal';
import type { TvSeriesSoundtrackTrackModel } from '../../../domain/models/tv-series-soundtrack-track.model';
import { CreateTvSeriesInfoModal } from '../create-tv-series-info-modal/create-tv-series-info-modal';
import { TvSeriesAudioMode } from '../../../domain/models/tv-series-audio-mode.model';
import type { TvSeriesSoundtrackModel } from '../../../domain/models/tv-series-soundtrack.model';
import { TvSeriesDetailSkeleton } from '../tv-series-detail-skeleton/tv-series-detail-skeleton';
import { TvSeriesDetailImage } from '../tv-series-detail-image/tv-series-detail-image';
import { TvSeriesTrackPlayer } from '../tv-series-track-player/tv-series-track-player';

@Component({
  selector: 'app-tv-series-detail-modal',
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
    TvSeriesDetailSkeleton,
    TvSeriesDetailImage,
    TvSeriesTrackPlayer,
  ],
  providers: [provideIcons({ lucidePlus, lucideRefreshCw })],
  templateUrl: './tv-series-detail-modal.html',
})
export class TvSeriesDetailModal implements ModalContent<TvSeriesDetailModalParams, void> {
  readonly params = injectBrnDialogContext<{ params: TvSeriesDetailModalParams }>().params;
  readonly ref = inject<BrnDialogRef<void>>(BrnDialogRef);
  private readonly clipboard = inject(Clipboard);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  protected copyId(id: string): void {
    if (this.clipboard.copy(id)) {
      this.notifications.success(this.transloco.translate('tvSeries.catalog.copied'));
    } else {
      this.notifications.error(this.transloco.translate('tvSeries.catalog.copyFailed'));
    }
  }
  private readonly facade = inject(TvSeriesFacade);
  private readonly language = inject(LanguageService);
  private readonly selectedLocale = signal<SupportedLocale | null>(null);
  private readonly modals = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly audioModes = TvSeriesAudioMode;
  protected readonly showAllTracks = signal(false);
  private audioRef?: BrnDialogRef<boolean>;
  protected manageAudio(
    mode: TvSeriesAudioMode,
    soundtrack?: TvSeriesSoundtrackModel,
    track?: TvSeriesSoundtrackTrackModel,
  ): void {
    if (this.audioRef || this.loading()) {
      return;
    }
    this.playingAudio?.pause();
    this.audioRef = this.modals.open(
      TvSeriesAudioModal,
      { mode, tvSeriesId: this.params.id, locale: this.locale(), soundtrack, track },
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
  private createInfoRef?: BrnDialogRef<SupportedLocale>;
  protected readonly missingLanguages = computed(() =>
    LANGUAGE_OPTIONS.map((option) => toSupportedLocale(option.code)).filter(
      (locale) => !this.locales().includes(locale),
    ),
  );
  private playingAudio?: HTMLAudioElement;
  protected readonly loading = this.facade.requests.getById.isLoading;
  protected readonly error = this.facade.requests.getById.error;
  protected readonly tvSeries = computed(() => {
    const tvSeries = this.facade.data.detail();
    return tvSeries?.id === this.params.id ? tvSeries : null;
  });
  protected readonly locales = computed(() => {
    const info = this.tvSeries()?.info;
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
    const tvSeries = this.tvSeries();
    return tvSeries ? resolveLocalized(tvSeries.info, this.locale()) : undefined;
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
      CreateTvSeriesInfoModal,
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
    tracks: ReadonlyArray<TvSeriesSoundtrackTrackModel>,
  ): ReadonlyArray<TvSeriesSoundtrackTrackModel> {
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
