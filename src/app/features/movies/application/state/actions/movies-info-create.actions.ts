import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { CreateMovieInfoModel } from '../../../domain/models/create-movie-info.model';
export const MoviesInfoCreateActions = createActionGroup({
  source: 'Movies Info Create',
  events: {
    Submitted: props<{ request: CreateMovieInfoModel }>(),
    Reset: emptyProps(),
  },
});
