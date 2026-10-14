import {
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { AUTH_REFRESH } from './application/tokens/auth-refresh.token';
import { AuthRefreshFacade } from './application/state/facades/auth-refresh.facade';
import { AuthTokenRefresh } from './infrastructure/http/auth-token-refresh';
import * as authRefreshEffects from './application/state/effects/auth-refresh.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import * as authFeedbackEffects from './application/state/effects/auth-login-feedback.effects';
import * as authLoginEffects from './application/state/effects/auth-login.effects';
import * as authSessionEffects from './application/state/effects/auth-session.effects';
import * as authUserEffects from './application/state/effects/auth-user.effects';
import { AuthStoreDataFacade } from './application/state/facades/auth-store-data.facade';
import { AuthFacade } from './application/state/facades/auth.facade';
import { authFeature } from './application/state/auth.feature';
import { ACCESS_TOKEN_PROVIDER } from './application/tokens/access-token-provider.token';
import { AUTH_FEEDBACK_PORT } from './application/tokens/auth-feedback.token';
import { AUTH_REPOSITORY } from './application/tokens/auth-repository.token';
import { AUTH_SESSION_STORAGE } from './application/tokens/auth-session-storage.token';
import { AuthFeedbackService } from './presentation/notifications/auth-feedback.service';
import { HttpAuthRepository } from './infrastructure/repositories/http-auth.repository';
import { LocalStorageAuthSessionStorage } from './infrastructure/storage/local-storage-auth-session.storage';

export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    AuthTokenRefresh,
    { provide: AUTH_REFRESH, useExisting: AuthRefreshFacade },
    { provide: AUTH_REPOSITORY, useClass: HttpAuthRepository },
    { provide: AUTH_SESSION_STORAGE, useClass: LocalStorageAuthSessionStorage },
    { provide: ACCESS_TOKEN_PROVIDER, useExisting: AuthStoreDataFacade },
    { provide: AUTH_FEEDBACK_PORT, useExisting: AuthFeedbackService },
    provideState(authFeature),
    provideEffects(
      authRefreshEffects,
      authSessionEffects,
      authLoginEffects,
      authUserEffects,
      authFeedbackEffects,
    ),
    provideAppInitializer(() => {
      inject(AuthFacade).actions.restoreSession();
    }),
  ]);
}
