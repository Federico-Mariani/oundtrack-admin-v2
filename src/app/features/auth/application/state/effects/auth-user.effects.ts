import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, takeUntil } from 'rxjs';
import type { AuthError } from '../../../domain/errors/auth-error';
import { AUTH_REPOSITORY } from '../../tokens/auth-repository.token';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthUserActions, AuthUserApiActions } from '../actions/auth-user.actions';

/**
 * Loads the profile of the current session.
 * `switchMap`: only the latest request matters. The in-flight call is dropped
 * when the session terminates, so a late response can never resurrect a user
 * after logout.
 */
export const loadCurrentUser$ = createEffect(
  (actions$ = inject(Actions), repository = inject(AUTH_REPOSITORY)) =>
    actions$.pipe(
      ofType(AuthUserActions.loadRequested),
      switchMap(() =>
        repository.getCurrentUser().pipe(
          map((user) => AuthUserApiActions.loadSucceeded({ user })),
          catchError((error: AuthError) => of(AuthUserApiActions.loadFailed({ error }))),
          takeUntil(actions$.pipe(ofType(AuthLogoutActions.requested, AuthSessionActions.expired))),
        ),
      ),
    ),
  { functional: true },
);
