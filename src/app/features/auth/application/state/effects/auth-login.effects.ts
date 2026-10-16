import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { AUTH_REPOSITORY } from '../../tokens/auth-repository.token';
import { AuthLoginActions } from '../actions/auth-login.actions';
import type { RequestError } from '@app/shared/state/request/request-error';

export const login$ = createEffect(
  (actions$ = inject(Actions), repository = inject(AUTH_REPOSITORY)) =>
    actions$.pipe(
      ofType(AuthLoginActions.requested),
      exhaustMap(({ credentials }) =>
        repository.login(credentials).pipe(
          map((session) => AuthLoginActions.succeeded({ session })),
          catchError((error: RequestError) => of(AuthLoginActions.failed({ error }))),
        ),
      ),
    ),
  { functional: true },
);
