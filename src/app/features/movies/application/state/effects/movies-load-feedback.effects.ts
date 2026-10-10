import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { MOVIES_FEEDBACK_PORT } from '../../tokens/movies-feedback.token';
import { MoviesLoadApiActions } from '../actions/api/movies-load-api.actions';

/**
 * Surfaces user feedback for auth outcomes, kept separate from the effects that
 * run the API calls: the login effect only maps to request/success/failure
 * actions, this one reacts to those actions. It delegates to the
 * `AuthFeedbackPort` (bound to a presentation adapter), so the application never
 * depends on Spartan or Transloco.
 *
 * `dispatch: false`: showing a toast is a pure side effect, it emits no action.
 */
export const moviesLoadFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(MOVIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(MoviesLoadApiActions.moviesLoadFailed),
      tap(({ error }) => {
        feedback.loadMoviesFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
