import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { authFeature } from '../auth.feature';

/** Read-only auth data as Signals. Never dispatches. */
@Injectable({ providedIn: 'root' })
export class AuthStoreDataFacade {
  private readonly store = inject(Store);

  readonly refreshSnapshot = this.store.selectSignal(authFeature.selectRefreshSnapshot);
  readonly refreshChanges$ = this.store.select(authFeature.selectRefreshSnapshot);

  readonly session = this.store.selectSignal(authFeature.selectSession);
  readonly user = this.store.selectSignal(authFeature.selectUser);
  readonly isAuthenticated = this.store.selectSignal(authFeature.selectIsAuthenticated);
  readonly accessToken = this.store.selectSignal(authFeature.selectAccessToken);
}
