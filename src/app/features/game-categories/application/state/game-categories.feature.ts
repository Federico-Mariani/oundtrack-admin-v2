import { createFeature, createSelector } from '@ngrx/store';
import { gameCategoriesReducer } from './game-categories.reducer';
import { isRequestPending, requestError } from '@shared/state/request/request-state.queries';

export const GAME_CATEGORIES_FEATURE_KEY = 'game-categories';

export const gameCategoriesFeature = createFeature({
  name: GAME_CATEGORIES_FEATURE_KEY,
  reducer: gameCategoriesReducer,
  extraSelectors: ({ selectLoadRequest }) => ({
    selectIsLoadingCategories: createSelector(selectLoadRequest, isRequestPending),
    selectCategoriesLoadError: createSelector(selectLoadRequest, requestError),
  }),
});
