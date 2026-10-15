import { gameCategoriesFeature } from '../game-categories.feature';
import { Store } from '@ngrx/store';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameCategoriesStoreLoadingStatusesFacade {
  private readonly store = inject(Store);

  readonly isLoadingGameCategories = this.store.selectSignal(
    gameCategoriesFeature.selectIsLoadingCategories,
  );
}
