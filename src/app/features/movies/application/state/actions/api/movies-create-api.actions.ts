import { createActionGroup, props } from '@ngrx/store';
import type { MovieModel } from '../../../../domain/models/movie.model';
import type { RequestError } from '@shared/state/request/request-error';
export const MoviesCreateApiActions = createActionGroup({
  source: 'Movies Create API',
  events: { Succeeded: props<{ movie: MovieModel }>(), Failed: props<{ error: RequestError }>() },
});
