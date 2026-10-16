import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { AUTH_FEEDBACK_PORT } from '../../tokens/auth-feedback.token';
import { AuthLoginActions } from '../actions/auth-login.actions';

export const loginFailedFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(AUTH_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(AuthLoginActions.failed),
      tap(({ error }) => {
        feedback.loginFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
