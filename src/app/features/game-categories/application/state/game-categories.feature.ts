import { GAME_CATEGORIES_STATE_DEFINITION } from './game-categories-state-definition';
import { createFeature } from '@ngrx/store';
import { gameCategoriesReducer } from './game-categories.reducer';

export const GAME_CATEGORIES_FEATURE_KEY = GAME_CATEGORIES_STATE_DEFINITION.key;

export const gameCategoriesFeature = createFeature({
  name: GAME_CATEGORIES_FEATURE_KEY,
  reducer: gameCategoriesReducer,
});
