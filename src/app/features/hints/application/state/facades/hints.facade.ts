import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { HintsStoreDataFacade } from './hints-store-data.facade';
import { HintsStoreRequestsFacade } from './hints-store-requests.facade';
import { HintsStoreActionsFacade } from './hints-store-actions.facade';
@Injectable({ providedIn: 'root' })
export class HintsFacade extends StoreFacade<
  HintsStoreDataFacade,
  HintsStoreRequestsFacade,
  HintsStoreActionsFacade
> {
  constructor() {
    super({
      data: HintsStoreDataFacade,
      requests: HintsStoreRequestsFacade,
      actions: HintsStoreActionsFacade,
    });
  }
}
