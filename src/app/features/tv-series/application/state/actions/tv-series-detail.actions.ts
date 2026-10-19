import { TV_SERIES_STATE_DEFINITION } from '../tv-series-state-definition';
import type { Id } from '@shared/types/id';
import { createActionGroup, props } from '@ngrx/store';

export const TvSeriesDetailActions = createActionGroup({
  source: `${TV_SERIES_STATE_DEFINITION.source} Get By Id` as const,
  events: {
    Requested: props<{ id: Id }>(),
    Closed: props<{ id: Id }>(),
  },
});
