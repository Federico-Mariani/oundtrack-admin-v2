import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { AUTH_REPOSITORY } from '../../tokens/auth-repository.token';
import { AuthLoginActions } from '../actions/auth-login.actions';
import type { RequestError } from '@app/shared/state/request/request-error';
import { AuthLoginApiActions } from '../actions/api/auth-login-api.actions';

export const login$ = createEffect(
  (actions$ = inject(Actions), repository = inject(AUTH_REPOSITORY)) =>
    actions$.pipe(
      ofType(AuthLoginActions.loginSubmitted),
      exhaustMap(({ credentials }) =>
        repository.login(credentials).pipe(
          map((session) => AuthLoginApiActions.loginSucceeded({ session })),
          catchError((error: RequestError) => of(AuthLoginApiActions.loginFailed({ error }))),
        ),
      ),
    ),
  { functional: true },
);
