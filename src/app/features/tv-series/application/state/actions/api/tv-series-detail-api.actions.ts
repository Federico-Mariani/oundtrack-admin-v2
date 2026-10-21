import { TvSeriesRequestOperation } from '../../tv-series-request-operation';
import { createActionGroup, props } from '@ngrx/store';
import type { Id } from '@shared/types/id';
import type { RequestError } from '@shared/state/request/request-error';
import { TV_SERIES_STATE_DEFINITION } from '../../tv-series-state-definition';
import type { TvSeriesDetailModel } from '../../../../domain/models/tv-series-detail.model';

export const TvSeriesDetailApiActions = createActionGroup({
  source: `${TV_SERIES_STATE_DEFINITION.source} ${TvSeriesRequestOperation.GetById} API` as const,
  events: {
    Succeeded: props<{ id: Id; tv: TvSeriesDetailModel }>(),
    Failed: props<{ id: Id; error: RequestError }>(),
  },
});
