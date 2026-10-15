import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { MOVIES_FEEDBACK_PORT } from '../../tokens/movies-feedback.token';
import { MoviesInfoCreateApiActions } from '../actions/api/movies-info-create-api.actions';
export const createMovieInfoFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(MOVIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(MoviesInfoCreateApiActions.succeeded, MoviesInfoCreateApiActions.failed),
      tap((action) => {
        if (action.type === MoviesInfoCreateApiActions.succeeded.type) {
          feedback.createInfoSucceeded();
        } else {
          feedback.createInfoFailed(action.error);
        }
      }),
    ),
  { functional: true, dispatch: false },
);
