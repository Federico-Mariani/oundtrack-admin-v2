import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { TvSeriesInfoCreateActions } from '../actions/tv-series-info-create.actions';
import type { TvSeriesState } from '../tv-series.state';

export const tvSeriesInfoCreateReducer: Array<
  ReducerTypes<TvSeriesState, ReadonlyArray<ActionCreator>>
> = [
  on(TvSeriesInfoCreateActions.requested, (state, { request }): TvSeriesState =>
    state.createInfoRequest.status === 'pending'
      ? state
      : { ...state, createInfoTarget: request, createInfoRequest: pendingRequest() },
  ),
  on(TvSeriesInfoCreateActions.reset, (state): TvSeriesState => ({
    ...state,
    createInfoTarget: null,
    createInfoRequest: idleRequest(),
  })),
  on(TvSeriesInfoCreateActions.succeeded, (state, { request }): TvSeriesState =>
    state.createInfoRequest.status === 'pending' &&
    state.createInfoTarget?.id === request.id &&
    state.createInfoTarget.language === request.language
      ? { ...state, createInfoRequest: succeededRequest() }
      : state,
  ),
  on(TvSeriesInfoCreateActions.failed, (state, { request, error }): TvSeriesState =>
    state.createInfoRequest.status === 'pending' &&
    state.createInfoTarget?.id === request.id &&
    state.createInfoTarget.language === request.language
      ? { ...state, createInfoRequest: failedRequest(error) }
      : state,
  ),
];
