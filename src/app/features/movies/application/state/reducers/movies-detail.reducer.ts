import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import type { MoviesState } from '../movies.state';
import { MoviesDetailActions } from '../actions/movies-detail.actions';
import { MoviesDetailApiActions } from '../actions/api/movies-detail-api.actions';
import {
  idleRequest,
  pendingRequest,
  succeededRequest,
  failedRequest,
} from '@shared/state/request/request-state.transitions';
export const moviesDetailReducer: Array<ReducerTypes<MoviesState, ReadonlyArray<ActionCreator>>> = [
  on(MoviesDetailActions.requested, (state, { id }): MoviesState => ({
    ...state,
    detailId: id,
    detail: null,
    detailRequest: pendingRequest(),
  })),
  on(MoviesDetailActions.closed, (state, { id }): MoviesState =>
    state.detailId === id
      ? { ...state, detailId: null, detail: null, detailRequest: idleRequest() }
      : state,
  ),
  on(MoviesDetailApiActions.succeeded, (state, { id, movie }): MoviesState =>
    state.detailId === id
      ? {
          ...state,
          movies: state.movies.map((item) => (item.id === id ? movie : item)),
          detail: movie,
          detailRequest: succeededRequest(),
        }
      : state,
  ),
  on(MoviesDetailApiActions.failed, (state, { id, error }): MoviesState =>
    state.detailId === id ? { ...state, detail: null, detailRequest: failedRequest(error) } : state,
  ),
];
