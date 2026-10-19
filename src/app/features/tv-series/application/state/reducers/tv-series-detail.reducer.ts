import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import type { TvSeriesState } from '../tv-series.state';
import { TvSeriesDetailActions } from '../actions/tv-series-detail.actions';
import { TvSeriesDetailApiActions } from '../actions/api/tv-series-detail-api.actions';

export const tvSeriesDetailReducer: Array<
  ReducerTypes<TvSeriesState, ReadonlyArray<ActionCreator>>
> = [
  on(TvSeriesDetailActions.requested, (state, { id }): TvSeriesState => ({
    ...state,
    detailId: id,
    detail: state.detailId === id ? state.detail : null,
    detailRequest: pendingRequest(),
  })),
  on(TvSeriesDetailActions.closed, (state, { id }): TvSeriesState =>
    state.detailId === id
      ? { ...state, detailId: null, detail: null, detailRequest: idleRequest() }
      : state,
  ),
  on(TvSeriesDetailApiActions.succeeded, (state, { id, tv }): TvSeriesState =>
    state.detailId === id
      ? {
          ...state,
          tvSeries: state.tvSeries.map((item) => (item.id === id ? tv : item)),
          detail: tv,
          detailRequest: succeededRequest(),
        }
      : state,
  ),
  on(TvSeriesDetailApiActions.failed, (state, { id, error }): TvSeriesState =>
    state.detailId === id ? { ...state, detailRequest: failedRequest(error) } : state,
  ),
];
