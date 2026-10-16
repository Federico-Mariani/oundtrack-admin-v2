import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { MOVIES_FEEDBACK_PORT } from '../../../tokens/movies-feedback.token';
import { MoviesInfoCreateActions } from '../../actions/movies-info-create.actions';

export const createMovieInfoSucceededFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(MOVIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(MoviesInfoCreateActions.succeeded),
      tap(() => {
        feedback.createInfoSucceeded();
      }),
    ),
  { functional: true, dispatch: false },
);

export const createMovieInfoFailedFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(MOVIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(MoviesInfoCreateActions.failed),
      tap(({ error }) => {
        feedback.createInfoFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
