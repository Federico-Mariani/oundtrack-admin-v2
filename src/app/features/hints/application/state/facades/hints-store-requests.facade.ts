import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { hintsFeature } from '../hints.feature';
import { createRequestSignals } from '@shared/state/request-signals';
@Injectable({ providedIn: 'root' })
export class HintsStoreRequestsFacade {
  private readonly store = inject(Store);
  readonly icons = createRequestSignals(this.store.selectSignal(hintsFeature.selectIconsRequest));
  readonly load = createRequestSignals(this.store.selectSignal(hintsFeature.selectLoadRequest));
  readonly save = createRequestSignals(this.store.selectSignal(hintsFeature.selectSaveRequest));
}
