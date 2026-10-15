import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { GameCategoriesStoreActionsFacade } from './game-categories-store-actions.facade';
import { GameCategoriesStoreDataFacade } from './game-categories-store-data.facade';
import { GameCategoriesStoreErrorStatusesFacade } from './game-categories-store-error-statuses.facade';
import { GameCategoriesStoreLoadingStatusesFacade } from './game-categories-store-loading-statuses.facade';

/**
 * Public application API of the Auth state. Presentation, guards and
 * interceptors talk to this facade only; NgRx actions and selectors stay
 * internal to `application/state`.
 */
@Injectable({ providedIn: 'root' })
export class GameCategoriesFacade extends StoreFacade<
  GameCategoriesStoreDataFacade,
  GameCategoriesStoreLoadingStatusesFacade,
  GameCategoriesStoreErrorStatusesFacade,
  GameCategoriesStoreActionsFacade
> {
  constructor() {
    super({
      data: GameCategoriesStoreDataFacade,
      loadingStatuses: GameCategoriesStoreLoadingStatusesFacade,
      errorStatuses: GameCategoriesStoreErrorStatusesFacade,
      actions: GameCategoriesStoreActionsFacade,
    });
  }
}
