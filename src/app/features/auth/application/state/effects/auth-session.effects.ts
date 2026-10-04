import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, tap } from 'rxjs';
import { isAccessTokenExpired } from '../../../domain/models/auth-session';
import { AUTH_SESSION_STORAGE } from '../../tokens/auth-session-storage.token';
import { AuthLoginApiActions } from '../actions/auth-login.actions';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthRegistrationApiActions } from '../actions/auth-registration.actions';
import { AuthSessionActions, AuthSessionStorageActions } from '../actions/auth-session.actions';
import { AuthUserActions, AuthUserApiActions } from '../actions/auth-user.actions';

/**
 * Rehydrates the session persisted by a previous visit.
 * Storage access is synchronous, so the outcome is reduced before the
 * `restoreRequested` dispatch returns and guards can rely on it right after
 * app initialization. An expired session counts as "no session".
 */
export const restoreSession$ = createEffect(
  (actions$ = inject(Actions), sessionStorage = inject(AUTH_SESSION_STORAGE)) =>
    actions$.pipe(
      ofType(AuthSessionActions.restoreRequested),
      map(() => {
        const session = sessionStorage.load();

        return session && !isAccessTokenExpired(session)
          ? AuthSessionStorageActions.restoreSucceeded({ session })
          : AuthSessionStorageActions.noSessionFound();
      }),
    ),
  { functional: true },
);

/** Every freshly issued session is persisted for the next visit. */
export const persistSession$ = createEffect(
  (actions$ = inject(Actions), sessionStorage = inject(AUTH_SESSION_STORAGE)) =>
    actions$.pipe(
      ofType(AuthLoginApiActions.succeeded, AuthRegistrationApiActions.succeeded),
      tap(({ session }) => {
        sessionStorage.save(session);
      }),
    ),
  { functional: true, dispatch: false },
);

/** Whatever terminates a session (logout, expiry, unusable persisted data) also clears storage. */
export const clearPersistedSession$ = createEffect(
  (actions$ = inject(Actions), sessionStorage = inject(AUTH_SESSION_STORAGE)) =>
    actions$.pipe(
      ofType(
        AuthLogoutActions.requested,
        AuthSessionActions.expired,
        AuthSessionStorageActions.noSessionFound,
      ),
      tap(() => {
        sessionStorage.clear();
      }),
    ),
  { functional: true, dispatch: false },
);

/** A session without a profile is incomplete: load the user as soon as one is established. */
export const loadUserAfterSessionEstablished$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(
        AuthLoginApiActions.succeeded,
        AuthRegistrationApiActions.succeeded,
        AuthSessionStorageActions.restoreSucceeded,
      ),
      map(() => AuthUserActions.loadRequested()),
    ),
  { functional: true },
);

/** The backend no longer accepts the token: the session is gone for good. */
export const expireSessionOnUnauthorized$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthUserApiActions.loadFailed),
      filter(({ error }) => error.code === 'unauthorized'),
      map(() => AuthSessionActions.expired()),
    ),
  { functional: true },
);
