import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameCategoriesFeature } from '../game-categories.feature';

/** Read-only Movies data as Signals. Never dispatches. */
@Injectable({ providedIn: 'root' })
export class GameCategoriesStoreDataFacade {
  private readonly store = inject(Store);

  readonly loaded = this.store.selectSignal(gameCategoriesFeature.selectLoaded);
  readonly assignmentId = this.store.selectSignal(gameCategoriesFeature.selectAssignmentId);
  readonly categories = this.store.selectSignal(gameCategoriesFeature.selectCategories);
}
