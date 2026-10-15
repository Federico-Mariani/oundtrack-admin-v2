import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { environment } from '@environments/environment';
import { moviesFeature } from '../application/state/movies.feature';
import * as createEffects from '../application/state/effects/movies-info-create.effects';
import * as feedbackEffects from '../application/state/effects/movies-info-create-feedback.effects';
import { MOVIES_REPOSITORY } from '../application/tokens/movies-repository.token';
import { MOVIES_FEEDBACK_PORT } from '../application/tokens/movies-feedback.token';
import type { MoviesFeedbackPort } from '../application/ports/movies-feedback.port';
import { HttpMoviesRepository } from '../infrastructure/repositories/http-movies.repository';
import { MoviesInfoCreateActions } from '../application/state/actions/movies-info-create.actions';
import { MoviesInfoCreateApiActions } from '../application/state/actions/api/movies-info-create-api.actions';
import { MoviesDetailActions } from '../application/state/actions/movies-detail.actions';
import type { SupportedLocale } from '@shared/localization/supported-locale';

describe('Movie translation creation', () => {
  let store: Store;
  let http: HttpTestingController;
  const feedback: MoviesFeedbackPort = {
    createInfoSucceeded: vi.fn(),
    createInfoFailed: vi.fn(),
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
  function submit(language: SupportedLocale = 'en-US') {
    store.dispatch(MoviesInfoCreateActions.submitted({ request: { id: 'movie/one', language } }));
  }
  it.each<[SupportedLocale, string]>([
    ['en-US', 'en-EN'],
    ['it-IT', 'it-IT'],
  ])('posts only language for %s and accepts an empty success response', (locale, language) => {
    submit(locale);
    expect(store.selectSignal(moviesFeature.selectIsCreatingInfo)()).toBe(true);
    const request = http.expectOne(`${environment.apiUrl}/movies/movie%2Fone/info`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ language });
    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(store.selectSignal(moviesFeature.selectInfoCreated)()).toBe(true);
    expect(store.selectSignal(moviesFeature.selectIsCreatingInfo)()).toBe(false);
    expect(feedback.createInfoSucceeded).toHaveBeenCalledOnce();
  });
  it('ignores duplicate submissions without changing the request target or detail state', () => {
    store.dispatch(MoviesDetailActions.requested({ id: 'movie/one' }));
    submit();
    submit('it-IT');
    expect(store.selectSignal(moviesFeature.selectCreateInfoTarget)()?.language).toBe('en-US');
    http.expectOne(`${environment.apiUrl}/movies/movie%2Fone/info`).flush({ data: {} });
    expect(store.selectSignal(moviesFeature.selectInfoCreated)()).toBe(true);
    expect(store.selectSignal(moviesFeature.selectIsLoadingDetail)()).toBe(true);
    expect(feedback.createInfoSucceeded).toHaveBeenCalledTimes(1);
  });
  it('reports errors, retains field errors and allows a retry', () => {
    submit();
    http
      .expectOne(`${environment.apiUrl}/movies/movie%2Fone/info`)
      .flush(
        { message: 'Invalid', fields: { language: ['Language unavailable'] } },
        { status: 422, statusText: 'Unprocessable Entity' },
      );
    const error = store.selectSignal(moviesFeature.selectCreateInfoError)();
    expect(error?.fieldErrors?.['language']).toEqual(['Language unavailable']);
    expect(feedback.createInfoFailed).toHaveBeenCalledExactlyOnceWith(error);
    submit();
    expect(store.selectSignal(moviesFeature.selectCreateInfoError)()).toBeNull();
    http.expectOne(`${environment.apiUrl}/movies/movie%2Fone/info`).flush({ data: {} });
    expect(feedback.createInfoSucceeded).toHaveBeenCalledOnce();
  });
  it('cancels on reset and ignores late state updates after the form has closed', () => {
    submit();
    const request = http.expectOne(`${environment.apiUrl}/movies/movie%2Fone/info`);
    store.dispatch(MoviesInfoCreateActions.reset());
    expect(request.cancelled).toBe(true);
    expect(store.selectSignal(moviesFeature.selectIsCreatingInfo)()).toBe(false);
    expect(feedback.createInfoSucceeded).not.toHaveBeenCalled();
    const reset = store.selectSignal(moviesFeature.selectMoviesState)();
    expect(
      moviesFeature.reducer(
        reset,
        MoviesInfoCreateApiActions.succeeded({ request: { id: 'movie/one', language: 'en-US' } }),
      ),
    ).toBe(reset);
  });
});
