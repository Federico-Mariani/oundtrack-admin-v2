import { MoviesRequestOperation } from '../movies-request-operation';
import { MOVIES_STATE_DEFINITION } from '../movies-state-definition';
import { createActionGroup, props } from '@ngrx/store';
import type { Id } from '@shared/types/id';

export const MoviesDetailActions = createActionGroup({
  source: `${MOVIES_STATE_DEFINITION.source} ${MoviesRequestOperation.GetById}` as const,
  events: {
    Requested: props<{ id: Id }>(),
    Closed: props<{ id: Id }>(),
  },
});
