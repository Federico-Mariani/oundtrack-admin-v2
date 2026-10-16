import { createReducer } from '@ngrx/store';
import { initialGameCategoriesState } from './game-categories.state';
import { gameCategoriesGetAllReducer } from './reducers/game-categories-get-all.reducer';

export const gameCategoriesReducer = createReducer(
  initialGameCategoriesState,
  ...gameCategoriesGetAllReducer,
);
