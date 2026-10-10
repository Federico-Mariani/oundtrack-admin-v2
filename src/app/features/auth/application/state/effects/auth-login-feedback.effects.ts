import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { AUTH_FEEDBACK_PORT } from '../../tokens/auth-feedback.token';
import { AuthLoginApiActions } from '../actions/api/auth-login-api.actions';

export const loginFailedFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(AUTH_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(AuthLoginApiActions.loginFailed),
      tap(({ error }) => {
        feedback.loginFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
