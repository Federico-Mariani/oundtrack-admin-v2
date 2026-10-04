import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { LoginCredentials } from '../../../domain/models/login-credentials';
import type { RegistrationData } from '../../../domain/models/registration-data';
import { AuthLoginActions } from '../actions/auth-login.actions';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthRegistrationActions } from '../actions/auth-registration.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthUserActions } from '../actions/auth-user.actions';

/** The only entry point through which intents reach the Auth store. */
@Injectable({ providedIn: 'root' })
export class AuthStoreActionsFacade {
  private readonly store = inject(Store);

  login(credentials: LoginCredentials): void {
    this.store.dispatch(AuthLoginActions.requested({ credentials }));
  }

  register(data: RegistrationData): void {
    this.store.dispatch(AuthRegistrationActions.requested({ data }));
  }

  restoreSession(): void {
    this.store.dispatch(AuthSessionActions.restoreRequested());
  }

  reloadCurrentUser(): void {
    this.store.dispatch(AuthUserActions.loadRequested());
  }

  logout(): void {
    this.store.dispatch(AuthLogoutActions.requested());
  }
}
