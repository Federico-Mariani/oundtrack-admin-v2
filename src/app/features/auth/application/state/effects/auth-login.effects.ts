import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import type { AuthError } from '../../../domain/errors/auth-error';
import { AUTH_REPOSITORY } from '../../tokens/auth-repository.token';
import { AuthLoginActions, AuthLoginApiActions } from '../actions/auth-login.actions';

/**
 * Exchanges credentials for a session.
 * `exhaustMap`: a second submit while one is in flight is ignored.
 */
export const login$ = createEffect(
  (actions$ = inject(Actions), repository = inject(AUTH_REPOSITORY)) =>
    actions$.pipe(
      ofType(AuthLoginActions.requested),
      exhaustMap(({ credentials }) =>
        repository.login(credentials).pipe(
          map((session) => AuthLoginApiActions.succeeded({ session })),
          catchError((error: AuthError) => of(AuthLoginApiActions.failed({ error }))),
        ),
      ),
    ),
  { functional: true },
);
