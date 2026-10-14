import { createActionGroup, props } from '@ngrx/store';
import type { MoviesListQuery } from '../../../../domain/models/movies-list-query.model';
import type { PageResult } from '@shared/types/pagination/page-result';
import type { MovieModel } from '../../../../domain/models/movie.model';
import type { RequestError } from '@shared/state/request/request-error';

export const MoviesLoadApiActions = createActionGroup({
  source: 'MOVIES (API) - Load',

  events: {
    'Movies Loaded': props<{
      readonly result: PageResult<MovieModel>;
      readonly query: MoviesListQuery;
    }>(),

    'Movies Load Failed': props<{
      readonly error: RequestError;
      readonly query: MoviesListQuery;
    }>(),
  },
});
