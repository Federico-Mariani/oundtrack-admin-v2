import { createFeature, createSelector } from '@ngrx/store';
import { isRequestPending, requestError } from '@shared/state/request/request-state.queries';
import { authReducer } from './auth.reducer';

export const AUTH_FEATURE_KEY = 'auth';

/**
 * Public definition of the Auth state.
 *
 * `createFeature` generates `selectAuthState` plus one selector per top-level
 * `AuthState` property: `selectSession`, `selectUser`, `selectLoginRequest`,
 * `selectRegistrationRequest`, `selectSessionRestoreRequest`,
 * `selectCurrentUserRequest`.
 *
 * `extraSelectors` holds the derived state only. Loading flags and errors are
 * tracked per operation, so several can be true / non-null at the same time.
 */
export const authFeature = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: authReducer,
  extraSelectors: ({
    selectSession,
    selectLoginRequest,
    selectRegistrationRequest,
    selectSessionRestoreRequest,
    selectCurrentUserRequest,
  }) => ({
    selectIsAuthenticated: createSelector(selectSession, (session) => session !== null),
    selectAccessToken: createSelector(selectSession, (session) => session?.accessToken ?? null),

    selectIsLoggingIn: createSelector(selectLoginRequest, isRequestPending),
    selectIsRegistering: createSelector(selectRegistrationRequest, isRequestPending),
    selectIsRestoringSession: createSelector(selectSessionRestoreRequest, isRequestPending),
    selectIsLoadingCurrentUser: createSelector(selectCurrentUserRequest, isRequestPending),

    selectLoginError: createSelector(selectLoginRequest, requestError),
    selectRegistrationError: createSelector(selectRegistrationRequest, requestError),
    selectSessionRestoreError: createSelector(selectSessionRestoreRequest, requestError),
    selectCurrentUserError: createSelector(selectCurrentUserRequest, requestError),
  }),
});
