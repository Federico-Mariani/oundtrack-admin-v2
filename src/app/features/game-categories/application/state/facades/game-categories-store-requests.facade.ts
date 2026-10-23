import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createRequestSignals } from '@shared/state/request-signals';
import { gameCategoriesFeature } from '../game-categories.feature';

@Injectable({ providedIn: 'root' })
export class GameCategoriesStoreRequestsFacade {
  private readonly store = inject(Store);

  readonly assignment = createRequestSignals(
    this.store.selectSignal(gameCategoriesFeature.selectAssignmentRequest),
  );
  readonly getAll = createRequestSignals(
    this.store.selectSignal(gameCategoriesFeature.selectLoadRequest),
  );
}
