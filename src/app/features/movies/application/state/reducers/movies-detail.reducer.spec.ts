import { moviesReducer } from '../movies.reducer';
import { initialMoviesState } from '../movies.state';
import { MoviesDetailActions } from '../actions/movies-detail.actions';
import { MoviesDetailApiActions } from '../actions/api/movies-detail-api.actions';
import type { MovieDetailModel } from '../../../domain/models/movie-detail.model';

const movie: MovieDetailModel = {
  id: 'movie',
  externalMovieId: 1,
  genres: [],
  info: {},
  createdAt: 0,
  updatedAt: 0,
  gameCategories: [],
  soundtracks: [],
};

describe('Movie detail refresh', () => {
  it('keeps the existing movie while refreshing and after a refresh failure', () => {
    const loaded = { ...initialMoviesState, detailId: movie.id, detail: movie };
    const refreshing = moviesReducer(loaded, MoviesDetailActions.requested({ id: movie.id }));
    expect(refreshing.detail).toBe(movie);
    const failed = moviesReducer(
      refreshing,
      MoviesDetailApiActions.failed({ id: movie.id, error: { code: 'network' } }),
    );
    expect(failed.detail).toBe(movie);
    expect(failed.detailRequest.error?.code).toBe('network');
    const updated = { ...movie, updatedAt: 123 };
    const refreshed = moviesReducer(
      failed,
      MoviesDetailApiActions.succeeded({ id: movie.id, movie: updated }),
    );
    expect(refreshed.detail).toBe(updated);
    expect(refreshed.detailRequest.error).toBeNull();
  });
  it('clears old content when opening a different movie and rejects old responses', () => {
    const state = moviesReducer(
      { ...initialMoviesState, detailId: movie.id, detail: movie },
      MoviesDetailActions.requested({ id: 'other' }),
    );
    expect(state.detail).toBeNull();
    expect(moviesReducer(state, MoviesDetailApiActions.succeeded({ id: movie.id, movie }))).toBe(
      state,
    );
  });
});
