import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { MoviesGetAllActions } from '../actions/movies-get-all.actions';
import type { MoviesState } from '../movies.state';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

export const moviesGetAllReducer: Array<ReducerTypes<MoviesState, ReadonlyArray<ActionCreator>>> = [
  on(MoviesGetAllActions.requested, (state, { query }): MoviesState => ({
    ...state,
    query,
    movies: [],
    loadRequest: pendingRequest(),
  })),
  on(MoviesGetAllActions.succeeded, (state, { result, query }): MoviesState =>
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
  on(MoviesGetAllActions.failed, (state, { error, query }): MoviesState =>
    state.query !== query ? state : { ...state, loadRequest: failedRequest(error) },
  ),
  on(MoviesGetAllActions.reset, (state): MoviesState => ({
    ...state,
    loadRequest: idleRequest(),
  })),
];
