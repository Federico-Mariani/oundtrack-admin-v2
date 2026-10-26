import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { AvatarsStoreActionsFacade } from './avatars-store-actions.facade';
import { AvatarsStoreDataFacade } from './avatars-store-data.facade';
import { AvatarsStoreRequestsFacade } from './avatars-store-requests.facade';

@Injectable({ providedIn: 'root' })
export class AvatarsFacade extends StoreFacade<
  AvatarsStoreDataFacade,
  AvatarsStoreRequestsFacade,
  AvatarsStoreActionsFacade
> {
  constructor() {
    super({
      data: AvatarsStoreDataFacade,
      requests: AvatarsStoreRequestsFacade,
      actions: AvatarsStoreActionsFacade,
    });
  }
}
