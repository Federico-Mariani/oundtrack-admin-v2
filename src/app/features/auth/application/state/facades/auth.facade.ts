import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { AuthStoreActionsFacade } from './auth-store-actions.facade';
import { AuthStoreDataFacade } from './auth-store-data.facade';
import { AuthStoreRequestsFacade } from './auth-store-requests.facade';

@Injectable({ providedIn: 'root' })
export class AuthFacade extends StoreFacade<
  AuthStoreDataFacade,
  AuthStoreRequestsFacade,
  AuthStoreActionsFacade
> {
  constructor() {
    super({
      data: AuthStoreDataFacade,
      requests: AuthStoreRequestsFacade,
      actions: AuthStoreActionsFacade,
    });
  }
}
