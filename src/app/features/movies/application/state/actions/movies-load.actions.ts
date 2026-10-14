import { createActionGroup, props } from '@ngrx/store';
import type { MoviesListQuery } from '../../../domain/models/movies-list-query.model';
export const MoviesLoadActions = createActionGroup({
  source: 'Movies Load',
  events: {
    'Movies Load Requested': props<{
      readonly query: MoviesListQuery;
      readonly debounce?: boolean;
    }>(),
  },
});
