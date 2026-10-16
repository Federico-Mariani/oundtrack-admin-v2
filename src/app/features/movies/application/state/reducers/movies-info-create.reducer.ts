import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import type { MoviesState } from '../movies.state';
import { MoviesInfoCreateActions } from '../actions/movies-info-create.actions';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

export const moviesInfoCreateReducer: Array<
  ReducerTypes<MoviesState, ReadonlyArray<ActionCreator>>
> = [
  on(MoviesInfoCreateActions.requested, (state, { request }): MoviesState =>
    state.createInfoRequest.status === 'pending'
      ? state
      : { ...state, createInfoTarget: request, createInfoRequest: pendingRequest() },
  ),
  on(MoviesInfoCreateActions.reset, (state): MoviesState => ({
    ...state,
    createInfoTarget: null,
    createInfoRequest: idleRequest(),
  })),
  on(MoviesInfoCreateActions.succeeded, (state, { request }): MoviesState =>
    state.createInfoRequest.status === 'pending' &&
    state.createInfoTarget?.id === request.id &&
    state.createInfoTarget.language === request.language
      ? { ...state, createInfoRequest: succeededRequest() }
      : state,
  ),
  on(MoviesInfoCreateActions.failed, (state, { request, error }): MoviesState =>
    state.createInfoRequest.status === 'pending' &&
    state.createInfoTarget?.id === request.id &&
    state.createInfoTarget.language === request.language
      ? { ...state, createInfoRequest: failedRequest(error) }
      : state,
  ),
];
