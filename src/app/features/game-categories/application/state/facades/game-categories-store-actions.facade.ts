import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameCategoriesLoadActions } from '../actions/game-categories-load.actions';

@Injectable({ providedIn: 'root' })
export class GameCategoriesStoreActionsFacade {
  private readonly store = inject(Store);

  loadCategories(): void {
    this.store.dispatch(GameCategoriesLoadActions.gameCategoriesLoadRequested());
  }
}
