import { categorySaveReducer } from './reducers/category-save.reducer';
import { createReducer } from '@ngrx/store';
import { initialGameCategoriesState } from './game-categories.state';
import { gameCategoriesGetAllReducer } from './reducers/game-categories-get-all.reducer';
import { gameCategoriesAssignReducer } from './reducers/game-categories-assign.reducer';
export const gameCategoriesReducer = createReducer(
  initialGameCategoriesState,
  ...gameCategoriesGetAllReducer,
  ...categorySaveReducer,
  ...gameCategoriesAssignReducer,
);
