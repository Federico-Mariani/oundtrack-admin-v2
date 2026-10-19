import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import { TV_SERIES_STATE_DEFINITION } from '../tv-series-state-definition';
import type { TvSeriesModel } from '../../../domain/models/tv-series.model';
import type { CreateTvSeriesModel } from '../../../domain/models/create-tv-series.model';

export const TvSeriesCreateActions = createRequestActions<
  { readonly tvSeries: CreateTvSeriesModel },
  { readonly tvSeries: TvSeriesModel },
  { readonly error: RequestError }
>(TV_SERIES_STATE_DEFINITION.source, 'Create');
