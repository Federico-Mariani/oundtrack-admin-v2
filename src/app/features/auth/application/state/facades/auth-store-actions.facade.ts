import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { LoginCredentialsModel } from '../../../domain/models/login-credentials.model';
import { AuthRefreshActions } from '../actions/auth-refresh.actions';
import { AuthLoginActions } from '../actions/auth-login.actions';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthCurrentUserActions } from '../actions/auth-current-user.actions';

/** The only entry point through which intents reach the Auth store. */
@Injectable({ providedIn: 'root' })
export class AuthStoreActionsFacade {
  private readonly store = inject(Store);

  refreshSession(generation: number): void {
    this.store.dispatch(AuthRefreshActions.requested({ generation }));
  }

  rejectSession(generation: number): void {
    this.store.dispatch(AuthRefreshActions.rejected({ generation }));
  }

  login(credentials: LoginCredentialsModel): void {
    this.store.dispatch(AuthLoginActions.requested({ credentials }));
  }

  restoreSession(): void {
    this.store.dispatch(AuthSessionActions.sessionRestoreRequested());
  }

  reloadCurrentUser(): void {
    this.store.dispatch(AuthCurrentUserActions.requested());
  }

  logout(): void {
    this.store.dispatch(AuthLogoutActions.logoutSubmitted());
  }
}
