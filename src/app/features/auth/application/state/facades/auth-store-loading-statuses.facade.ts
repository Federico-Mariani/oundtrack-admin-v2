import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { authFeature } from '../auth.feature';

/** Per-operation loading flags as Signals; the logic lives in `authFeature` extra selectors. */
@Injectable({ providedIn: 'root' })
export class AuthStoreLoadingStatusesFacade {
  private readonly store = inject(Store);

  readonly isLoggingIn = this.store.selectSignal(authFeature.selectIsLoggingIn);
  readonly isRegistering = this.store.selectSignal(authFeature.selectIsRegistering);
  readonly isRestoringSession = this.store.selectSignal(authFeature.selectIsRestoringSession);
  readonly isLoadingCurrentUser = this.store.selectSignal(authFeature.selectIsLoadingCurrentUser);
}
