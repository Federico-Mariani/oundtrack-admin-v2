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
    detail.set(movie());
    loading.set(false);
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Interstellar');
    expect(document.body.textContent).toContain('Film');
    expect(document.body.textContent).toContain('Hans Zimmer');
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
});
