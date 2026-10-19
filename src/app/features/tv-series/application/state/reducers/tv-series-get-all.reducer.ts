import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import type { TvSeriesState } from '../tv-series.state';
import { TvSeriesGetAllActions } from '../actions/tv-series-get-all.actions';

export const tvSeriesGetAllReducer: Array<
  ReducerTypes<TvSeriesState, ReadonlyArray<ActionCreator>>
> = [
  on(TvSeriesGetAllActions.requested, (state, { query }): TvSeriesState => ({
    ...state,
    query,
    tvSeries: [],
    loadRequest: pendingRequest(),
  })),
  on(TvSeriesGetAllActions.succeeded, (state, { result, query }): TvSeriesState =>
    state.query !== query
      ? state
      : {
          ...state,
          tvSeries: result.items,
          total: result.total,
          query: { ...query, page: result.page, limit: result.limit },
          loadRequest: succeededRequest(),
        },
  ),
  on(TvSeriesGetAllActions.failed, (state, { error, query }): TvSeriesState =>
    state.query !== query ? state : { ...state, loadRequest: failedRequest(error) },
  ),
  on(TvSeriesGetAllActions.reset, (state): TvSeriesState => ({
    ...state,
    loadRequest: idleRequest(),
  })),
];
