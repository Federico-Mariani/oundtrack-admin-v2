import { createReducer } from '@ngrx/store';
import { initialGameCategoriesState } from './game-categories.state';
import { gameCategoriesLoadReducer } from './reducers/game-categories-load.reducer';

/**
 * Root reducer of the single Movies feature state, composed from one
 * micro-reducer per capability. Each capability only touches its own slice.
 */
export const gameCategoriesReducer = createReducer(
  initialGameCategoriesState,
  ...gameCategoriesLoadReducer,
);
