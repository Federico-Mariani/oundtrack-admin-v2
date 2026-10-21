import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { hintsFeature } from '../hints.feature';
@Injectable({ providedIn: 'root' })
export class HintsStoreDataFacade {
  private readonly store = inject(Store);
  readonly hints = this.store.selectSignal(hintsFeature.selectHints);
  readonly loaded = this.store.selectSignal(hintsFeature.selectLoaded);
  readonly sessionId = this.store.selectSignal(hintsFeature.selectSessionId);
  readonly saveId = this.store.selectSignal(hintsFeature.selectSaveId);
}
