import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { MoviesLoadActions } from '../actions/movies-load.actions';
import type { MoviesState } from '../movies.state';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { MoviesLoadApiActions } from '../actions/api/movies-load-api.actions';

export const moviesLoadReducer: ReducerTypes<MoviesState, readonly ActionCreator[]>[] = [
  on(MoviesLoadActions.moviesLoadRequested, (state, { query }): MoviesState => ({
    ...state,
    query,
    movies: [],
    loadRequest: pendingRequest(),
  })),
  on(MoviesLoadApiActions.moviesLoaded, (state, { result, query }): MoviesState =>
    state.query !== query
      ? state
      : {
          ...state,
          movies: result.items,
          total: result.total,
          query: { ...query, page: result.page, limit: result.limit },
          loadRequest: succeededRequest(),
        },
  ),
  on(MoviesLoadApiActions.moviesLoadFailed, (state, { error, query }): MoviesState =>
    state.query !== query ? state : { ...state, loadRequest: failedRequest(error) },
  ),
];
