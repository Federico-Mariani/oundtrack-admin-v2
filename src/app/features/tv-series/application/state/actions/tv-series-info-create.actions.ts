import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { CreateTvSeriesInfoModel } from '../../../domain/models/create-tv-series-info.model';
import { TV_SERIES_STATE_DEFINITION } from '../tv-series-state-definition';

export const TvSeriesInfoCreateActions = createRequestActions<
  { readonly request: CreateTvSeriesInfoModel },
  { readonly request: CreateTvSeriesInfoModel },
  { readonly request: CreateTvSeriesInfoModel; readonly error: RequestError }
>(TV_SERIES_STATE_DEFINITION.source, 'Create Info');
