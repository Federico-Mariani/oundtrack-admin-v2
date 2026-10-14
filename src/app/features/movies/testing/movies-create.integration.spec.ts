import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { environment } from '@environments/environment';
import { moviesFeature } from '../application/state/movies.feature';
import * as createEffects from '../application/state/effects/movies-create.effects';
import * as feedbackEffects from '../application/state/effects/movies-create-feedback.effects';
import { MOVIES_REPOSITORY } from '../application/tokens/movies-repository.token';
import { MOVIES_FEEDBACK_PORT } from '../application/tokens/movies-feedback.token';
import { HttpMoviesRepository } from '../infrastructure/repositories/http-movies.repository';
import { MoviesCreateActions } from '../application/state/actions/movies-create.actions';
import { MoviesLoadActions } from '../application/state/actions/movies-load.actions';
import { DEFAULT_MOVIES_LIST_QUERY } from '../domain/models/movies-list-query.model';
import type { SupportedLocale } from '@shared/localization/supported-locale';

const movieResponse = {
  id: 'movie-1',
  externalMovieId: 42,
  genres: [],
  info: [],
  createdAt: 0,
  updatedAt: 0,
};

describe('Movie creation workflow', () => {
  let store: Store;
  let http: HttpTestingController;
  const feedback = {
    createMovieSucceeded: vi.fn(),
    createMovieFailed: vi.fn(),
    loadMoviesFailed: vi.fn(),
  };
  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideStore({ [moviesFeature.name]: moviesFeature.reducer }),
        provideEffects(createEffects, feedbackEffects),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MOVIES_REPOSITORY, useClass: HttpMoviesRepository },
        { provide: MOVIES_FEEDBACK_PORT, useValue: feedback },
      ],
    });
    store = TestBed.inject<Store>(Store);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
  });
  function submit(language: SupportedLocale = 'it-IT') {
    store.dispatch(
      MoviesCreateActions.submitted({ movie: { title: '  Dragon  ', year: 2025, language } }),
    );
  }

  it.each<[SupportedLocale, string]>([
    ['it-IT', 'it-IT'],
    ['en-US', 'en-EN'],
  ])('posts the required payload for %s and reports success', (language, apiLanguage) => {
    submit(language);
    expect(store.selectSignal(moviesFeature.selectIsCreatingMovie)()).toBe(true);
    const request = http.expectOne(`${environment.apiUrl}/movies`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'Dragon', year: 2025, language: apiLanguage });
    request.flush({ data: movieResponse });
    expect(store.selectSignal(moviesFeature.selectMovieCreated)()).toBe(true);
    expect(store.selectSignal(moviesFeature.selectIsCreatingMovie)()).toBe(false);
    expect(feedback.createMovieSucceeded).toHaveBeenCalledExactlyOnceWith();
  });

  it('ignores duplicate submissions and preserves an independent list request', () => {
    store.dispatch(MoviesLoadActions.moviesLoadRequested({ query: DEFAULT_MOVIES_LIST_QUERY }));
    submit();
    submit();
    http.expectOne(`${environment.apiUrl}/movies`).flush({ data: movieResponse });
    expect(store.selectSignal(moviesFeature.selectIsLoadingMovies)()).toBe(true);
    expect(feedback.createMovieSucceeded).toHaveBeenCalledTimes(1);
  });

  it('retains API field errors and allows retry after failure', () => {
    submit();
    http.expectOne(`${environment.apiUrl}/movies`).flush(
      {
        message: 'Invalid movie',
        fields: {
          title: ['Unknown title'],
          year: ['Invalid year'],
          language: ['Unsupported language'],
        },
      },
      { status: 422, statusText: 'Unprocessable Entity' },
    );
    const error = store.selectSignal(moviesFeature.selectMovieCreateError)();
    expect(error?.fieldErrors?.['title']).toEqual(['Unknown title']);
    expect(feedback.createMovieFailed).toHaveBeenCalledWith(error);
    expect(store.selectSignal(moviesFeature.selectIsCreatingMovie)()).toBe(false);
    submit();
    expect(store.selectSignal(moviesFeature.selectMovieCreateError)()).toBeNull();
    http.expectOne(`${environment.apiUrl}/movies`).flush({ data: movieResponse });
    expect(feedback.createMovieSucceeded).toHaveBeenCalledTimes(1);
  });

  it('cancels obsolete work when the creation screen is reset', () => {
    submit();
    const request = http.expectOne(`${environment.apiUrl}/movies`);
    store.dispatch(MoviesCreateActions.reset());
    expect(request.cancelled).toBe(true);
    expect(store.selectSignal(moviesFeature.selectIsCreatingMovie)()).toBe(false);
    expect(feedback.createMovieSucceeded).not.toHaveBeenCalled();
  });
});
