import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, takeUntil } from 'rxjs';
import { AUTH_REPOSITORY } from '../../tokens/auth-repository.token';
import { authFeature } from '../auth.feature';
import { AuthRefreshActions } from '../actions/auth-refresh.actions';
import { AuthSessionStorageActions } from '../actions/auth-session-storage.actions';
import { AuthLoginActions } from '../actions/auth-login.actions';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import type { RequestError } from '@shared/state/request/request-error';

export const refreshSession$ = createEffect(
  (actions$ = inject(Actions), repository = inject(AUTH_REPOSITORY), store = inject(Store)) =>
    actions$.pipe(
      ofType(AuthRefreshActions.requested),
      switchMap(({ generation }) => {
        const { session } = store.selectSignal(authFeature.selectRefreshSnapshot)();
        if (!session) {
          return of(AuthRefreshActions.failed({ generation, error: { code: 'unauthorized' } }));
        }
        return repository.refreshSession(session.refreshToken).pipe(
          map((session) => AuthRefreshActions.succeeded({ generation, session })),
          catchError((error: RequestError) => of(AuthRefreshActions.failed({ generation, error }))),
          takeUntil(
            actions$.pipe(
              ofType(
                AuthLogoutActions.logoutSubmitted,
                AuthSessionActions.sessionExpired,
                AuthLoginActions.requested,
                AuthLoginActions.succeeded,
                AuthSessionStorageActions.sessionRestored,
              ),
            ),
          ),
        );
      }),
    ),
  { functional: true },
);

export const rejectSession$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(AuthRefreshActions.rejected),
      filter(({ generation }) => store.selectSignal(authFeature.selectGeneration)() === generation),
      map(() => AuthSessionActions.sessionExpired()),
    ),
  { functional: true },
);
