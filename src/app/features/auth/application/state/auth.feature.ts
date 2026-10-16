import { createFeature, createSelector } from '@ngrx/store';
import { authReducer } from './auth.reducer';

export const AUTH_FEATURE_KEY = 'auth';

export const authFeature = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: authReducer,
  extraSelectors: ({ selectSession, selectGeneration, selectRefreshRequest }) => ({
    selectRefreshSnapshot: createSelector(
      selectSession,
      selectGeneration,
      selectRefreshRequest,
      (session, generation, request) => ({
        session,
        generation,
        request,
      }),
    ),
    selectIsAuthenticated: createSelector(selectSession, (session) => session !== null),
    selectAccessToken: createSelector(selectSession, (session) => session?.accessToken ?? null),
  }),
});
