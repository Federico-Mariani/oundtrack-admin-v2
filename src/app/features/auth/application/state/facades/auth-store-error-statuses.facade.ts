import {inject, Injectable, type Signal} from '@angular/core';
import { Store } from '@ngrx/store';
import { authFeature } from '../auth.feature';
import type {RequestError} from "@shared/state/request/request-error";

/** Per-operation errors as Signals; errors of different operations can coexist. */
@Injectable({ providedIn: 'root' })
export class AuthStoreErrorStatusesFacade {
  private readonly store = inject(Store);

  readonly login: Signal<RequestError | null> = this.store.selectSignal(authFeature.selectLoginError);
  readonly registration: Signal<RequestError | null> = this.store.selectSignal(authFeature.selectRegistrationError);
  readonly sessionRestore: Signal<RequestError | null> = this.store.selectSignal(authFeature.selectSessionRestoreError);
  readonly currentUser: Signal<RequestError | null> = this.store.selectSignal(authFeature.selectCurrentUserError);
}
