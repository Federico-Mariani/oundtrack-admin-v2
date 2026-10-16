import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { GameCategoriesStoreActionsFacade } from './game-categories-store-actions.facade';
import { GameCategoriesStoreDataFacade } from './game-categories-store-data.facade';
import { GameCategoriesStoreRequestsFacade } from './game-categories-store-requests.facade';

@Injectable({ providedIn: 'root' })
export class GameCategoriesFacade extends StoreFacade<
  GameCategoriesStoreDataFacade,
  GameCategoriesStoreRequestsFacade,
  GameCategoriesStoreActionsFacade
> {
  constructor() {
    super({
      data: GameCategoriesStoreDataFacade,
      requests: GameCategoriesStoreRequestsFacade,
      actions: GameCategoriesStoreActionsFacade,
    });
  }
}
