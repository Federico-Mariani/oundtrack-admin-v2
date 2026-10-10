import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { LoginCredentials } from '../../../domain/models/login-credentials';
import { AuthLoginActions } from '../actions/auth-login.actions';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthCurrentUserActions } from '../actions/auth-current-user.actions';

/** The only entry point through which intents reach the Auth store. */
@Injectable({ providedIn: 'root' })
export class AuthStoreActionsFacade {
  private readonly store = inject(Store);

  login(credentials: LoginCredentials): void {
    this.store.dispatch(AuthLoginActions.loginSubmitted({ credentials }));
  }

  restoreSession(): void {
    this.store.dispatch(AuthSessionActions.sessionRestoreRequested());
  }

  reloadCurrentUser(): void {
    this.store.dispatch(AuthCurrentUserActions.currentUserLoadRequested());
  }

  logout(): void {
    this.store.dispatch(AuthLogoutActions.logoutSubmitted());
  }
}
