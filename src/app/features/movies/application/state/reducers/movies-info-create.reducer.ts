import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import type { MoviesState } from '../movies.state';
import { MoviesInfoCreateActions } from '../actions/movies-info-create.actions';
import { MoviesInfoCreateApiActions } from '../actions/api/movies-info-create-api.actions';
import {
  idleRequest,
  pendingRequest,
  succeededRequest,
  failedRequest,
} from '@shared/state/request/request-state.transitions';
export const moviesInfoCreateReducer: Array<
  ReducerTypes<MoviesState, ReadonlyArray<ActionCreator>>
> = [
  on(MoviesInfoCreateActions.submitted, (state, { request }): MoviesState =>
    state.createInfoRequest.status === 'pending'
      ? state
      : { ...state, createInfoTarget: request, createInfoRequest: pendingRequest() },
  ),
  on(MoviesInfoCreateActions.reset, (state): MoviesState => ({
    ...state,
    createInfoTarget: null,
    createInfoRequest: idleRequest(),
  })),
  on(MoviesInfoCreateApiActions.succeeded, (state, { request }): MoviesState =>
    state.createInfoRequest.status === 'pending' &&
    state.createInfoTarget?.id === request.id &&
    state.createInfoTarget.language === request.language
      ? { ...state, createInfoRequest: succeededRequest() }
      : state,
  ),
  on(MoviesInfoCreateApiActions.failed, (state, { request, error }): MoviesState =>
    state.createInfoRequest.status === 'pending' &&
    state.createInfoTarget?.id === request.id &&
    state.createInfoTarget.language === request.language
      ? { ...state, createInfoRequest: failedRequest(error) }
      : state,
  ),
];
