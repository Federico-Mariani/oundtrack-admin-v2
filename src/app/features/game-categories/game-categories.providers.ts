import * as assignmentEffects from './application/state/effects/game-categories-assign.effects';
import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { GAME_CATEGORIES_REPOSITORY } from './application/tokens/game-categories-repository.token';
import { HttpGameCategoriesRepository } from './infrastructure/repositories/http-game-categories.repository';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { gameCategoriesFeature } from './application/state/game-categories.feature';
import * as getAllEffects from './application/state/effects/game-categories-get-all.effects';

export function provideGameCategories(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: GAME_CATEGORIES_REPOSITORY, useClass: HttpGameCategoriesRepository },
    provideState(gameCategoriesFeature),
    provideEffects(getAllEffects, assignmentEffects),
  ]);
}
