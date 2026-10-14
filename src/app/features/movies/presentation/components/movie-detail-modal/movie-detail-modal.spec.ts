import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTransloco, provideTranslocoScope } from '@jsverse/transloco';
import { of } from 'rxjs';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { ModalService } from '@shared/ui/modal/modal.service';
import type { RequestError } from '@shared/state/request/request-error';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import type { MovieDetailModel } from '../../../domain/models/movie-detail.model';
import { moviesTranslationsLoader } from '../../i18n/movies-translations.loader';
import { MovieDetailModal } from './movie-detail-modal';

@Component({
  selector: 'app-movie-detail-test-owner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTranslocoScope({ scope: 'movies', loader: moviesTranslationsLoader })],
  template: '',
})
class MovieDetailTestOwner {
  readonly viewContainerRef = inject(ViewContainerRef);
}
class EmptyTranslationLoader {
  getTranslation() {
    return of({});
  }
}
function movie(): MovieDetailModel {
  return {
    id: 'one',
    externalMovieId: 157336,
    createdAt: 0,
    updatedAt: 0,
    genres: [],
    info: {
      'it-IT': {
        id: 'info',
        title: 'Interstellar',
        releaseDate: 1415145600000,
        posterUrl: 'https://example.com/poster.jpg',
        backdropUrl: '',
        createdAt: 0,
        updatedAt: 0,
      },
    },
    gameCategories: [
      { id: 'category', image: null, info: { 'it-IT': { id: 'cat-info', name: 'Film' } } },
    ],
    soundtracks: [
      {
        id: 'soundtrack',
        tracks: [
          {
            id: 'track',
            externalId: 'external',
            name: 'S.T.A.Y.',
            artist: 'Hans Zimmer',
            language: 'it-IT',
            path: 'https://example.com/track.mp3',
          },
        ],
      },
    ],
  };
}
describe('Movie detail modal', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  function setup() {
    const detail = signal<MovieDetailModel | null>(null);
    const loading = signal(true);
    const error = signal<RequestError | null>(null);
    const actions = { loadDetail: vi.fn(), closeDetail: vi.fn() };
    TestBed.configureTestingModule({
      imports: [MovieDetailTestOwner],
      providers: [
        {
          provide: MoviesFacade,
          useValue: {
            data: { detail },
            loadingStatuses: { isLoadingDetail: loading },
            errorStatuses: { detail: error },
            actions,
          },
        },
        { provide: LanguageService, useValue: { activeLocale: signal('en-US') } },
        provideTransloco({
          config: {
            availableLangs: ['en', 'it'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
            prodMode: true,
          },
          loader: EmptyTranslationLoader,
        }),
      ],
    });
    const fixture = TestBed.createComponent(MovieDetailTestOwner);
    const ref = TestBed.inject(ModalService).open(
      MovieDetailModal,
      { id: 'one' },
      {
        viewContainerRef: fixture.componentInstance.viewContainerRef,
        contentClass: 'sm:max-w-5xl p-0 overflow-hidden',
      },
    );
    return { fixture, ref, detail, loading, error, actions };
  }
  it('loads the requested movie, renders localized fallback and media, and clears state on close', async () => {
    const { fixture, ref, detail, loading, actions } = setup();
    await fixture.whenStable();
    expect(actions.loadDetail).toHaveBeenCalledExactlyOnceWith('one');
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Loading movie');
    });
    expect(document.querySelector('app-movie-detail-skeleton')).not.toBeNull();
    expect(document.querySelector('hlm-spinner')).toBeNull();
    detail.set(movie());
    loading.set(false);
    await fixture.whenStable();
    expect(document.querySelector('app-movie-detail-skeleton')).toBeNull();
    expect(document.body.textContent).toContain('Interstellar');
    expect(document.body.textContent).toContain('Film');
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Hans Zimmer');
    });
    const audio = document.querySelector('audio')!;
    expect(audio.preload).toBe('none');
    expect(audio.autoplay).toBe(false);
    audio.dispatchEvent(new Event('play'));
    const image = document.querySelector<HTMLImageElement>('img[alt="Interstellar"]')!;
    image.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Image unavailable');
    ref.forceClose();
    expect(actions.closeDetail).toHaveBeenCalledExactlyOnceWith('one');
    expect(audio.pause).toHaveBeenCalled();
    fixture.destroy();
  });
  it('shows request failures, supports retry, and renders empty sections', async () => {
    const { fixture, ref, detail, loading, error, actions } = setup();
    loading.set(false);
    error.set({ code: 'not-found', status: 404 });
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('This movie is no longer available.');
    });
    Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
      .find((button) => button.textContent.includes('Try again'))!
      .click();
    expect(actions.loadDetail).toHaveBeenCalledTimes(2);
    error.set(null);
    detail.set({ ...movie(), gameCategories: [], soundtracks: [] });
    await fixture.whenStable();
    expect(document.body.textContent).toContain('No game categories available.');
    expect(document.body.textContent).toContain('No tracks available.');
    ref.forceClose();
    fixture.destroy();
  });
  it('offers a detail reload when a signed audio URL is unavailable', async () => {
    const { fixture, ref, detail, loading, actions } = setup();
    detail.set(movie());
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelector('audio')).not.toBeNull();
    });
    document.querySelector('audio')!.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Audio unavailable.');
    Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
      .find((button) => button.textContent.includes('Reload details'))!
      .click();
    expect(actions.loadDetail).toHaveBeenCalledTimes(2);
    ref.forceClose();
    fixture.destroy();
  });
  it('provides custom playback, seek, volume and technical information controls', async () => {
    const { fixture, ref, detail, loading } = setup();
    const first = movie();
    const track = first.soundtracks[0].tracks[0];
    detail.set({
      ...first,
      soundtracks: [
        {
          id: 'soundtrack',
          tracks: [track, { ...track, id: 'track-two', name: 'Cornfield Chase' }],
        },
      ],
    });
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelectorAll('audio')).toHaveLength(2);
    });
    const audio = document.querySelectorAll('audio')[0];
    const second = document.querySelectorAll('audio')[1];
    let paused = true;
    vi.spyOn(audio, 'paused', 'get').mockImplementation(() => paused);
    vi.spyOn(audio, 'duration', 'get').mockReturnValue(150);
    vi.spyOn(audio, 'play').mockImplementation(() => {
      paused = false;
      audio.dispatchEvent(new Event('play'));
      audio.dispatchEvent(new Event('playing'));
      return Promise.resolve();
    });
    const pause = vi.spyOn(audio, 'pause').mockImplementation(() => {
      paused = true;
      audio.dispatchEvent(new Event('pause'));
    });
    const button = (label: string): HTMLButtonElement =>
      document.querySelector<HTMLButtonElement>(`button[aria-label="${label}: S.T.A.Y."]`)!;
    expect(audio.controls).toBe(false);
    expect(document.querySelector('app-movie-detail-modal details')).toBeNull();
    button('Play').click();
    await fixture.whenStable();
    expect(audio.play).toHaveBeenCalledOnce();
    expect(button('Pause')).not.toBeNull();
    audio.dispatchEvent(new Event('loadedmetadata'));
    await fixture.whenStable();
    const seek = document.querySelector<HTMLInputElement>(
      'input[aria-label="Playback position: S.T.A.Y."]',
    )!;
    expect(seek.disabled).toBe(false);
    seek.value = '65';
    seek.dispatchEvent(new Event('input'));
    expect(audio.currentTime).toBe(65);
    const volume = document.querySelector<HTMLInputElement>(
      'input[aria-label="Volume: S.T.A.Y."]',
    )!;
    volume.value = '0.4';
    volume.dispatchEvent(new Event('input'));
    expect(audio.volume).toBe(0.4);
    button('Mute').click();
    await fixture.whenStable();
    expect(audio.muted).toBe(true);
    button('Unmute').click();
    await fixture.whenStable();
    expect(audio.muted).toBe(false);
    second.dispatchEvent(new Event('play'));
    await fixture.whenStable();
    expect(pause).toHaveBeenCalled();
    expect(button('Play')).not.toBeNull();
    expect(document.getElementById('track-info-soundtrack-track')).toBeNull();
    button('Track information').click();
    await fixture.whenStable();
    expect(button('Track information').getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('track-info-soundtrack-track')?.textContent).toContain(
      'external',
    );
    ref.forceClose();
    fixture.destroy();
  });
  it('handles rejected playback without leaving the custom player pending', async () => {
    const { fixture, ref, detail, loading } = setup();
    detail.set(movie());
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelector('audio')).not.toBeNull();
    });
    const audio = document.querySelector('audio')!;
    vi.spyOn(audio, 'play').mockRejectedValue(
      new DOMException('Cannot decode', 'NotSupportedError'),
    );
    document.querySelector<HTMLButtonElement>('button[aria-label="Play: S.T.A.Y."]')!.click();
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Audio unavailable.');
    expect(document.querySelector('button[aria-label="Play: S.T.A.Y."]')).toBeNull();
    ref.forceClose();
    fixture.destroy();
  });
});
