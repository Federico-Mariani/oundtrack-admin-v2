import { createActionGroup, props } from '@ngrx/store';
import type { CreateMovieInfoModel } from '../../../../domain/models/create-movie-info.model';
import type { RequestError } from '@shared/state/request/request-error';
export const MoviesInfoCreateApiActions = createActionGroup({
  source: 'Movies Info Create API',
  events: {
    Succeeded: props<{ request: CreateMovieInfoModel }>(),
    Failed: props<{ request: CreateMovieInfoModel; error: RequestError }>(),
  },
});
