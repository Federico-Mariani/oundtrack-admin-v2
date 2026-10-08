import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { AUTH_FEEDBACK_PORT } from '../../tokens/auth-feedback.token';
import { AuthLoginApiActions } from '../actions/auth-login.actions';

/**
 * Surfaces user feedback for auth outcomes, kept separate from the effects that
 * run the API calls: the login effect only maps to request/success/failure
 * actions, this one reacts to those actions. It delegates to the
 * `AuthFeedbackPort` (bound to a presentation adapter), so the application never
 * depends on Spartan or Transloco.
 *
 * `dispatch: false`: showing a toast is a pure side effect, it emits no action.
 */
export const loginFailedFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(AUTH_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(AuthLoginApiActions.failed),
      tap(({ error }) => {
        feedback.loginFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
