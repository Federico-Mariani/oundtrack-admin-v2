import { InjectionToken } from '@angular/core';
import type { GameCategoriesRepositoryPort } from '../ports/game-categories-repository.port';

export const GAME_CATEGORIES_REPOSITORY = new InjectionToken<GameCategoriesRepositoryPort>(
  'GAME_CATEGORIES_REPOSITORY',
);
