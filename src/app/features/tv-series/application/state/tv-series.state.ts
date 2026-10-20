import type { RequestState } from '@shared/state/request/request-state';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import type { RequestError } from '@shared/state/request/request-error';
import type { Id } from '@shared/types/id';
import type { CreateTvSeriesInfoCommand } from '../commands/create-tv-series-info.command';
import type { TvSeriesDetailModel } from '../../domain/models/tv-series-detail.model';
import type { TvSeriesModel } from '../../domain/models/tv-series.model';
import {
  DEFAULT_TV_SERIES_LIST_QUERY,
  type TvSeriesListQuery,
} from '../queries/tv-series-list.query';

export interface TvSeriesState {
  readonly createInfoTarget: CreateTvSeriesInfoCommand | null;
  readonly createInfoRequest: RequestState<RequestError>;
  readonly detailId: Id | null;
  readonly detail: TvSeriesDetailModel | null;
  readonly detailRequest: RequestState<RequestError>;
  readonly tvSeries: ReadonlyArray<TvSeriesModel>;
  readonly query: TvSeriesListQuery;
  readonly total: number;
  readonly createRequest: RequestState<RequestError>;
  readonly loadRequest: RequestState<RequestError>;
}

export const initialTvSeriesState: TvSeriesState = {
  createInfoTarget: null,
  createInfoRequest: idleRequest(),
  detailId: null,
  detail: null,
  detailRequest: idleRequest(),
  tvSeries: [],
  query: DEFAULT_TV_SERIES_LIST_QUERY,
  total: 0,
  loadRequest: idleRequest(),
  createRequest: idleRequest(),
};
