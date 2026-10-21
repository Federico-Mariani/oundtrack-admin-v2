import { TvSeriesRequestOperation } from '../tv-series-request-operation';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { CreateTvSeriesInfoCommand } from '../../commands/create-tv-series-info.command';
import { TV_SERIES_STATE_DEFINITION } from '../tv-series-state-definition';

export const TvSeriesInfoCreateActions = createRequestActions<
  { readonly request: CreateTvSeriesInfoCommand },
  { readonly request: CreateTvSeriesInfoCommand },
  { readonly request: CreateTvSeriesInfoCommand; readonly error: RequestError }
>(TV_SERIES_STATE_DEFINITION.source, TvSeriesRequestOperation.CreateInfo);
