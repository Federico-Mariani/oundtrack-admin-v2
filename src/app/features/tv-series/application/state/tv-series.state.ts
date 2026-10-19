import type { RequestState } from '@shared/state/request/request-state';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import type { RequestError } from '@shared/state/request/request-error';
import type { Id } from '@shared/types/id';
import type { CreateTvSeriesInfoModel } from '../../domain/models/create-tv-series-info.model';
import type { TvSeriesDetailModel } from '../../domain/models/tv-series-detail.model';
import type { TvSeriesModel } from '../../domain/models/tv-series.model';
import {
  DEFAULT_TV_SERIES_LIST_QUERY,
  type TvSeriesListQuery,
} from '../../domain/models/tv-series-list-query.model';
import { initialTvSeriesAudioState, type TvSeriesAudioState } from './tv-series-audio.state';

export interface TvSeriesState {
  readonly audio: TvSeriesAudioState;
  readonly audioRequest: RequestState<RequestError>;
  readonly createInfoTarget: CreateTvSeriesInfoModel | null;
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
  audio: initialTvSeriesAudioState,
  audioRequest: idleRequest(),
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
