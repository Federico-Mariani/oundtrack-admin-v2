import { avatarsFeature } from '../avatars.feature';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
@Injectable({ providedIn: 'root' })
export class AvatarsStoreDataFacade {
  private readonly store = inject(Store);
  readonly avatars = this.store.selectSignal(avatarsFeature.selectAvatars);
  readonly progress = this.store.selectSignal(avatarsFeature.selectProgress);
  readonly phase = this.store.selectSignal(avatarsFeature.selectPhase);
  readonly requestId = this.store.selectSignal(avatarsFeature.selectRequestId);
}
