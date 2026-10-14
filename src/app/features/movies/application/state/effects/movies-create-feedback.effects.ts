import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { MOVIES_FEEDBACK_PORT } from '../../tokens/movies-feedback.token';
import { MoviesCreateApiActions } from '../actions/api/movies-create-api.actions';
export const createMovieFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(MOVIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(MoviesCreateApiActions.succeeded, MoviesCreateApiActions.failed),
      tap((action) => {
        if (action.type === MoviesCreateApiActions.succeeded.type) {
          feedback.createMovieSucceeded();
        } else {
          feedback.createMovieFailed(action.error);
        }
      }),
    ),
  { functional: true, dispatch: false },
);
