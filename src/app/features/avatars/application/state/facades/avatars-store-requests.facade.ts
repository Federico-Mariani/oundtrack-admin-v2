import { avatarsFeature } from '../avatars.feature';
import { createRequestSignals } from '@shared/state/request-signals';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
@Injectable({ providedIn: 'root' })
export class AvatarsStoreRequestsFacade {
  private readonly store = inject(Store);
  readonly getAll = createRequestSignals(this.store.selectSignal(avatarsFeature.selectLoadRequest));
  readonly save = createRequestSignals(this.store.selectSignal(avatarsFeature.selectSaveRequest));
}
