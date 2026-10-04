import {
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import * as authLoginEffects from './application/state/effects/auth-login.effects';
import * as authRegistrationEffects from './application/state/effects/auth-registration.effects';
import * as authSessionEffects from './application/state/effects/auth-session.effects';
import * as authUserEffects from './application/state/effects/auth-user.effects';
import { AuthStoreDataFacade } from './application/state/facades/auth-store-data.facade';
import { AuthFacade } from './application/state/facades/auth.facade';
import { authFeature } from './application/state/auth.feature';
import { ACCESS_TOKEN_PROVIDER } from './application/tokens/access-token-provider.token';
import { AUTH_REPOSITORY } from './application/tokens/auth-repository.token';
import { AUTH_SESSION_STORAGE } from './application/tokens/auth-session-storage.token';
import { HttpAuthRepository } from './infrastructure/repositories/http-auth.repository';
import { LocalStorageAuthSessionStorage } from './infrastructure/storage/local-storage-auth-session.storage';

/**
 * Composition root of the Auth feature: binds ports to their implementations,
 * registers the NgRx feature state and effects, and restores the persisted
 * session before the first navigation.
 *
 * Auth is application-wide (guards, interceptor, bootstrap), so register it
 * once in `app.config.ts` after `provideStore()`. `authTokenInterceptor` is
 * registered separately with `provideHttpClient(withInterceptors([...]))`.
 */
export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: AUTH_REPOSITORY, useClass: HttpAuthRepository },
    { provide: AUTH_SESSION_STORAGE, useClass: LocalStorageAuthSessionStorage },
    // The interceptor reads the token through this port; the store stays the single source of truth.
    { provide: ACCESS_TOKEN_PROVIDER, useExisting: AuthStoreDataFacade },
    provideState(authFeature),
    provideEffects(authSessionEffects, authLoginEffects, authRegistrationEffects, authUserEffects),
    provideAppInitializer(() => {
      inject(AuthFacade).actions.restoreSession();
    }),
  ]);
}
