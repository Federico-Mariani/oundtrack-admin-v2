import { createActionGroup, props } from '@ngrx/store';
import type { RequestError } from '@shared/state/request/request-error';
import type { GameCategoryModel } from '../../../../domain/models/game-category.model';

export const GameCategoriesLoadApiActions = createActionGroup({
  source: 'GAME CATEGORIES (API) - Load',
  events: {
    'Game Categories Loaded': props<{
      readonly categories: Array<GameCategoryModel>;
    }>(),
    'Game Categories Load Failed': props<{
      readonly error: RequestError;
    }>(),
  },
});
