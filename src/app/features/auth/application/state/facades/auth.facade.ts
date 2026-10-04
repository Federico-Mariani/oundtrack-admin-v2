import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { AuthStoreActionsFacade } from './auth-store-actions.facade';
import { AuthStoreDataFacade } from './auth-store-data.facade';
import { AuthStoreErrorStatusesFacade } from './auth-store-error-statuses.facade';
import { AuthStoreLoadingStatusesFacade } from './auth-store-loading-statuses.facade';

/**
 * Public application API of the Auth state. Presentation, guards and
 * interceptors talk to this facade only; NgRx actions and selectors stay
 * internal to `application/state`.
 */
@Injectable({ providedIn: 'root' })
export class AuthFacade extends StoreFacade<
  AuthStoreDataFacade,
  AuthStoreLoadingStatusesFacade,
  AuthStoreErrorStatusesFacade,
  AuthStoreActionsFacade
> {
  constructor() {
    super({
      data: AuthStoreDataFacade,
      loadingStatuses: AuthStoreLoadingStatusesFacade,
      errorStatuses: AuthStoreErrorStatusesFacade,
      actions: AuthStoreActionsFacade,
    });
  }
}
