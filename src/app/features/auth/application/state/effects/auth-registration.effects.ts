import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import type { AuthError } from '../../../domain/errors/auth-error';
import { AUTH_REPOSITORY } from '../../tokens/auth-repository.token';
import {
  AuthRegistrationActions,
  AuthRegistrationApiActions,
} from '../actions/auth-registration.actions';

/**
 * Creates the account and receives its first session.
 * `exhaustMap`: a double submit must not create two accounts.
 */
export const register$ = createEffect(
  (actions$ = inject(Actions), repository = inject(AUTH_REPOSITORY)) =>
    actions$.pipe(
      ofType(AuthRegistrationActions.requested),
      exhaustMap(({ data }) =>
        repository.register(data).pipe(
          map((session) => AuthRegistrationApiActions.succeeded({ session })),
          catchError((error: AuthError) => of(AuthRegistrationApiActions.failed({ error }))),
        ),
      ),
    ),
  { functional: true },
);
