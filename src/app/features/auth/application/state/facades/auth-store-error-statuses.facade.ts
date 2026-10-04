import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { authFeature } from '../auth.feature';

/** Per-operation errors as Signals; errors of different operations can coexist. */
@Injectable({ providedIn: 'root' })
export class AuthStoreErrorStatusesFacade {
  private readonly store = inject(Store);

  readonly login = this.store.selectSignal(authFeature.selectLoginError);
  readonly registration = this.store.selectSignal(authFeature.selectRegistrationError);
  readonly sessionRestore = this.store.selectSignal(authFeature.selectSessionRestoreError);
  readonly currentUser = this.store.selectSignal(authFeature.selectCurrentUserError);
}
