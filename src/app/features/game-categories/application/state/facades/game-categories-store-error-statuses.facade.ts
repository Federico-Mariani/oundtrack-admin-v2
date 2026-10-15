import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameCategoriesFeature } from '../game-categories.feature';

/** Per-operation errors as Signals; errors of different operations can coexist. */
@Injectable({ providedIn: 'root' })
export class GameCategoriesStoreErrorStatusesFacade {
  private readonly store = inject(Store);

  readonly loadCategories = this.store.selectSignal(
    gameCategoriesFeature.selectCategoriesLoadError,
  );
}
