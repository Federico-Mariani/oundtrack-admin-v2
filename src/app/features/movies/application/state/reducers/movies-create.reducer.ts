import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import type { MoviesState } from '../movies.state';
import { MoviesCreateActions } from '../actions/movies-create.actions';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

export const moviesCreateReducer: Array<ReducerTypes<MoviesState, ReadonlyArray<ActionCreator>>> = [
  on(MoviesCreateActions.requested, (state): MoviesState => ({
    ...state,
    createRequest: pendingRequest(),
  })),
  on(MoviesCreateActions.reset, (state): MoviesState => ({
    ...state,
    createRequest: idleRequest(),
  })),
  on(MoviesCreateActions.succeeded, (state): MoviesState => ({
    ...state,
    createRequest: succeededRequest(),
  })),
  on(MoviesCreateActions.failed, (state, { error }): MoviesState => ({
    ...state,
    createRequest: failedRequest(error),
  })),
];
