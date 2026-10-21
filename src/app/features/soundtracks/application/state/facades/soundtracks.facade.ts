import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { SoundtracksStoreActionsFacade } from './soundtracks-store-actions.facade';
import { SoundtracksStoreDataFacade } from './soundtracks-store-data.facade';
import { SoundtracksStoreRequestsFacade } from './soundtracks-store-requests.facade';

@Injectable({ providedIn: 'root' })
export class SoundtracksFacade extends StoreFacade<
  SoundtracksStoreDataFacade,
  SoundtracksStoreRequestsFacade,
  SoundtracksStoreActionsFacade
> {
  constructor() {
    super({
      data: SoundtracksStoreDataFacade,
      requests: SoundtracksStoreRequestsFacade,
      actions: SoundtracksStoreActionsFacade,
    });
  }
}
