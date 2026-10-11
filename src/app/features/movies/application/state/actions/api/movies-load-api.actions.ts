import { createActionGroup, props } from '@ngrx/store';
import type { MovieModel } from '../../../../domain/models/movie.model';
import type { RequestError } from '@shared/state/request/request-error';

export const MoviesLoadApiActions = createActionGroup({
  source: 'MOVIES (API) - Load',

  events: {
    'Movies Loaded': props<{
      readonly movies: readonly MovieModel[];
    }>(),

    'Movies Load Failed': props<{
      readonly error: RequestError;
    }>(),
  },
});
