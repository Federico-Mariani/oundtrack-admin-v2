import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { PageResult } from '@shared/types/pagination/page-result';
import { TV_SERIES_STATE_DEFINITION } from '../tv-series-state-definition';
import type { TvSeriesListQuery } from '../../../domain/models/tv-series-list-query.model';
import type { TvSeriesModel } from '../../../domain/models/tv-series.model';

export const TvSeriesGetAllActions = createRequestActions<
  {
    readonly query: TvSeriesListQuery;
    readonly debounce?: boolean;
  },
  {
    readonly result: PageResult<TvSeriesModel>;
    readonly query: TvSeriesListQuery;
  },
  {
    readonly error: RequestError;
    readonly query: TvSeriesListQuery;
  }
>(TV_SERIES_STATE_DEFINITION.source, 'Get All');
