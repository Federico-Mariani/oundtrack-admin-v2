import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { TvSeriesCreateActions } from '../actions/tv-series-create.actions';
import type { TvSeriesState } from '../tv-series.state';

export const tvSeriesCreateReducer: Array<
  ReducerTypes<TvSeriesState, ReadonlyArray<ActionCreator>>
> = [
  on(TvSeriesCreateActions.requested, (state): TvSeriesState => ({
    ...state,
    createRequest: pendingRequest(),
  })),
  on(TvSeriesCreateActions.reset, (state): TvSeriesState => ({
    ...state,
    createRequest: idleRequest(),
  })),
  on(TvSeriesCreateActions.succeeded, (state): TvSeriesState => ({
    ...state,
    createRequest: succeededRequest(),
  })),
  on(TvSeriesCreateActions.failed, (state, { error }): TvSeriesState => ({
    ...state,
    createRequest: failedRequest(error),
  })),
];
