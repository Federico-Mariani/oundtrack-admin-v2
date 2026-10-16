import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { authFeature } from '../auth.feature';
import { AuthRefreshActions } from '../actions/auth-refresh.actions';
import { filter, map, tap } from 'rxjs';
import { isRefreshTokenExpired } from '../../../domain/models/auth-session.model';
import { AUTH_SESSION_STORAGE } from '../../tokens/auth-session-storage.token';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthCurrentUserActions } from '../actions/auth-current-user.actions';
import { AuthSessionStorageActions } from '../actions/auth-session-storage.actions';
import { AuthLoginActions } from '../actions/auth-login.actions';

export const restoreSession$ = createEffect(
  (actions$ = inject(Actions), sessionStorage = inject(AUTH_SESSION_STORAGE)) =>
    actions$.pipe(
      ofType(AuthSessionActions.sessionRestoreRequested),
      map(() => {
        const session = sessionStorage.load();

        return session && !isRefreshTokenExpired(session)
          ? AuthSessionStorageActions.sessionRestored({ session })
          : AuthSessionStorageActions.sessionNotFound();
      }),
    ),
  { functional: true },
);

export const persistSession$ = createEffect(
  (
    actions$ = inject(Actions),
    sessionStorage = inject(AUTH_SESSION_STORAGE),
    store = inject(Store),
  ) =>
    actions$.pipe(
      ofType(AuthLoginActions.succeeded, AuthRefreshActions.succeeded),
      filter(({ session }) => store.selectSignal(authFeature.selectSession)() === session),
      tap(({ session }) => {
        sessionStorage.save(session);
      }),
    ),
  { functional: true, dispatch: false },
);

export const clearPersistedSession$ = createEffect(
  (actions$ = inject(Actions), sessionStorage = inject(AUTH_SESSION_STORAGE)) =>
    actions$.pipe(
      ofType(
        AuthLogoutActions.logoutSubmitted,
        AuthSessionActions.sessionExpired,
        AuthSessionStorageActions.sessionNotFound,
      ),
      tap(() => {
        sessionStorage.clear();
      }),
    ),
  { functional: true, dispatch: false },
);

export const loadUserAfterSessionEstablished$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthLoginActions.succeeded, AuthSessionStorageActions.sessionRestored),
      map(() => AuthCurrentUserActions.requested()),
    ),
  { functional: true },
);
