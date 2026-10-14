import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import type { MoviesState } from '../movies.state';
import { MoviesCreateActions } from '../actions/movies-create.actions';
import { MoviesCreateApiActions } from '../actions/api/movies-create-api.actions';
import {
  idleRequest,
  pendingRequest,
  succeededRequest,
  failedRequest,
} from '@shared/state/request/request-state.transitions';
export const moviesCreateReducer: ReducerTypes<MoviesState, readonly ActionCreator[]>[] = [
  on(MoviesCreateActions.submitted, (state): MoviesState => ({
    ...state,
    createRequest: pendingRequest(),
  })),
  on(MoviesCreateActions.reset, (state): MoviesState => ({
    ...state,
    createRequest: idleRequest(),
  })),
  on(MoviesCreateApiActions.succeeded, (state): MoviesState => ({
    ...state,
    createRequest: succeededRequest(),
  })),
  on(MoviesCreateApiActions.failed, (state, { error }): MoviesState => ({
    ...state,
    createRequest: failedRequest(error),
  })),
];
