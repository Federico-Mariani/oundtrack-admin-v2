import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { CreateMovieModel } from '../../../domain/models/create-movie.model';
export const MoviesCreateActions = createActionGroup({
  source: 'Movies Create',
  events: { Submitted: props<{ movie: CreateMovieModel }>(), Reset: emptyProps() },
});
