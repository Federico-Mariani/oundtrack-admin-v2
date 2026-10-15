import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { GAME_CATEGORIES_REPOSITORY } from './application/tokens/game-categories-repository.token';
import { HttpGameCategoriesRepository } from './infrastructure/repositories/http-game-categories.repository';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as loadGameCategoriesEffect from '../game-categories/application/state/effects/game-categories-load.effects';
import { gameCategoriesFeature } from './application/state/game-categories.feature';

export function provideGameCategories(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: GAME_CATEGORIES_REPOSITORY, useClass: HttpGameCategoriesRepository },
    provideState(gameCategoriesFeature),
    provideEffects(loadGameCategoriesEffect),
  ]);
}
