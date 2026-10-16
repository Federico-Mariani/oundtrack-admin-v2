import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { MOVIES_FEEDBACK_PORT } from '../../../tokens/movies-feedback.token';
import { MoviesCreateActions } from '../../actions/movies-create.actions';

export const createMovieSucceededFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(MOVIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(MoviesCreateActions.succeeded),
      tap(() => {
        feedback.createMovieSucceeded();
      }),
    ),
  { functional: true, dispatch: false },
);

export const createMovieFailedFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(MOVIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(MoviesCreateActions.failed),
      tap(({ error }) => {
        feedback.createMovieFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
