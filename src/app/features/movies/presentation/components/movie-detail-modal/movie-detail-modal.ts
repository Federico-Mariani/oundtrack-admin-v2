import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { TranslocoDirective } from '@jsverse/transloco';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { resolveLocalized } from '@shared/localization/localized.queries';
import type { Localized } from '@shared/localization/localized';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { Button } from '@shared/ui/button/button';
import { MovieDetailSkeleton } from '../movie-detail-skeleton/movie-detail-skeleton';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { MovieDetailImage } from '../movie-detail-image/movie-detail-image';
import { MovieTrackPlayer } from '../movie-track-player/movie-track-player';
import type { MovieTrackModel } from '../../../domain/models/movie-track.model';
import type { MovieDetailModalParams } from './movie-detail-modal-params';
@Component({
  selector: 'app-movie-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ModalFrame,
    Button,
    MovieDetailSkeleton,
    MovieDetailImage,
    MovieTrackPlayer,
  ],
  templateUrl: './movie-detail-modal.html',
  styleUrl: './movie-detail-modal.css',
})
export class MovieDetailModal implements ModalContent<MovieDetailModalParams, void> {
  readonly params = injectBrnDialogContext<{ params: MovieDetailModalParams }>().params;
  readonly ref = inject<BrnDialogRef<void>>(BrnDialogRef);
  private readonly facade = inject(MoviesFacade);
  private readonly language = inject(LanguageService);
  private readonly selectedLocale = signal<SupportedLocale | null>(null);
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
  protected reload(): void {
    this.playingAudio?.pause();
    this.facade.actions.loadDetail(this.params.id);
  }
  protected changeLocale(event: Event): void {
    const value = event.target instanceof HTMLSelectElement ? event.target.value : '';
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
  protected localizedTracks(tracks: readonly MovieTrackModel[]): readonly MovieTrackModel[] {
    return tracks.filter((track) => track.language === this.locale());
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
