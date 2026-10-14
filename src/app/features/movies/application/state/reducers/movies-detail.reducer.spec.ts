import { moviesReducer } from '../movies.reducer';
import { initialMoviesState, type MoviesState } from '../movies.state';
import { MoviesDetailActions } from '../actions/movies-detail.actions';
import { MoviesDetailApiActions } from '../actions/api/movies-detail-api.actions';
import { pendingRequest } from '@shared/state/request/request-state.transitions';
describe('Movie detail state isolation', () => {
  it('keeps list and creation requests intact and ignores late responses after close', () => {
    const initial: MoviesState = {
      ...initialMoviesState,
      loadRequest: pendingRequest(),
      createRequest: pendingRequest(),
    };
    const requested = moviesReducer(initial, MoviesDetailActions.requested({ id: 'one' }));
    expect(requested.loadRequest).toBe(initial.loadRequest);
    expect(requested.createRequest).toBe(initial.createRequest);
    const failed = moviesReducer(
      requested,
      MoviesDetailApiActions.failed({ id: 'one', error: { code: 'network' } }),
    );
    expect(failed.loadRequest).toBe(initial.loadRequest);
    const closed = moviesReducer(failed, MoviesDetailActions.closed({ id: 'one' }));
    expect(closed.detailId).toBeNull();
    expect(
      moviesReducer(
        closed,
        MoviesDetailApiActions.failed({ id: 'one', error: { code: 'network' } }),
      ),
    ).toBe(closed);
    expect(
      moviesReducer(
        closed,
        MoviesDetailApiActions.succeeded({
          id: 'one',
          movie: {
            id: 'one',
            externalMovieId: 1,
            info: {},
            genres: [],
            soundtracks: [],
            gameCategories: [],
            createdAt: 0,
            updatedAt: 0,
          },
        }),
      ),
    ).toBe(closed);
  });
});
