import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, takeUntil } from 'rxjs';
import { AUTH_REPOSITORY } from '../../tokens/auth-repository.token';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthCurrentUserActions } from '../actions/auth-current-user.actions';
import type { RequestError } from '@shared/state/request/request-error';
import { AuthCurrentUserApiActions } from '../actions/api/auth-current-user-api.actions';

export const loadCurrentUser$ = createEffect(
  (actions$ = inject(Actions), repository = inject(AUTH_REPOSITORY)) =>
    actions$.pipe(
      ofType(AuthCurrentUserActions.currentUserLoadRequested),
      switchMap(() =>
        repository.getCurrentUser().pipe(
          map((user) => AuthCurrentUserApiActions.currentUserLoaded({ user })),
          catchError((error: RequestError) =>
            of(AuthCurrentUserApiActions.currentUserLoadFailed({ error })),
          ),
          takeUntil(
            actions$.pipe(
              ofType(AuthLogoutActions.logoutSubmitted, AuthSessionActions.sessionExpired),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
