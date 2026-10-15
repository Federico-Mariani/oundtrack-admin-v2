import { createActionGroup, props } from '@ngrx/store';
import type { Id } from '@shared/types/id';
export const MoviesDetailActions = createActionGroup({
  source: 'Movies Detail',
  events: {
    Requested: props<{ id: Id }>(),
    Closed: props<{ id: Id }>(),
  },
});
