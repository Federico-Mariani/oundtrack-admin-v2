import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createRequestSignals } from '@shared/state/request-signals';
import { authFeature } from '../auth.feature';

@Injectable({ providedIn: 'root' })
export class AuthStoreRequestsFacade {
  private readonly store = inject(Store);

  readonly login = createRequestSignals(this.store.selectSignal(authFeature.selectLoginRequest));

  readonly registration = createRequestSignals(
    this.store.selectSignal(authFeature.selectRegistrationRequest),
  );

  readonly sessionRestore = createRequestSignals(
    this.store.selectSignal(authFeature.selectSessionRestoreRequest),
  );

  readonly currentUser = createRequestSignals(
    this.store.selectSignal(authFeature.selectCurrentUserRequest),
  );

  readonly refresh = createRequestSignals(
    this.store.selectSignal(authFeature.selectRefreshRequest),
  );
}
