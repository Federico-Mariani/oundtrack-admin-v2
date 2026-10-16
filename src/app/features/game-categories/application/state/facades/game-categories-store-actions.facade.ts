import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameCategoriesGetAllActions } from '../actions/game-categories-get-all.actions';

@Injectable({ providedIn: 'root' })
export class GameCategoriesStoreActionsFacade {
  private readonly store = inject(Store);

  getAll(): void {
    this.store.dispatch(GameCategoriesGetAllActions.requested());
  }

  resetGetAll(): void {
    this.store.dispatch(GameCategoriesGetAllActions.reset());
  }
}
