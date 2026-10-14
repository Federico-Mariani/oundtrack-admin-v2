import { moviesReducer } from '../movies.reducer';
import { initialMoviesState } from '../movies.state';
import { MoviesLoadActions } from '../actions/movies-load.actions';
import { MoviesLoadApiActions } from '../actions/api/movies-load-api.actions';
import { DEFAULT_MOVIES_LIST_QUERY } from '../../../domain/models/movies-list-query.model';

describe('Movies query state', () => {
  it('ignores results and errors that no longer belong to the active query', () => {
    const oldQuery = { ...DEFAULT_MOVIES_LIST_QUERY };
    const query = { ...DEFAULT_MOVIES_LIST_QUERY, page: 2 };
    const pending = moviesReducer(
      initialMoviesState,
      MoviesLoadActions.moviesLoadRequested({ query }),
    );
    expect(pending.loadRequest.status).toBe('pending');
    expect(
      moviesReducer(
        pending,
        MoviesLoadApiActions.moviesLoaded({
          query: oldQuery,
          result: { items: [], page: 1, limit: 20, total: 9 },
        }),
      ),
    ).toBe(pending);
    expect(
      moviesReducer(
        pending,
        MoviesLoadApiActions.moviesLoadFailed({ query: oldQuery, error: { code: 'network' } }),
      ),
    ).toBe(pending);
    const loaded = moviesReducer(
      pending,
      MoviesLoadApiActions.moviesLoaded({
        query,
        result: { items: [], page: 2, limit: 20, total: 42 },
      }),
    );
    expect(loaded.total).toBe(42);
    expect(loaded.loadRequest.status).toBe('success');
  });
});
