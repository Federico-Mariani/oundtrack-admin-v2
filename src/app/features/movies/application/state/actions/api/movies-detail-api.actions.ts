import { createActionGroup, props } from '@ngrx/store';
import type { Id } from '@shared/types/id';
import type { RequestError } from '@shared/state/request/request-error';
import type { MovieDetailModel } from '../../../../domain/models/movie-detail.model';
export const MoviesDetailApiActions = createActionGroup({
  source: 'Movies Detail API',
  events: {
    Succeeded: props<{ id: Id; movie: MovieDetailModel }>(),
    Failed: props<{ id: Id; error: RequestError }>(),
  },
});
