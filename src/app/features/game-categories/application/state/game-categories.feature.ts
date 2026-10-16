import { createFeature } from '@ngrx/store';
import { gameCategoriesReducer } from './game-categories.reducer';

export const GAME_CATEGORIES_FEATURE_KEY = 'game-categories';

export const gameCategoriesFeature = createFeature({
  name: GAME_CATEGORIES_FEATURE_KEY,
  reducer: gameCategoriesReducer,
});
