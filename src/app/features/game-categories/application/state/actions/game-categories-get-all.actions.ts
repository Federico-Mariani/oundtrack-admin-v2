import { GAME_CATEGORIES_STATE_DEFINITION } from '../game-categories-state-definition';
import { GameCategoriesRequestOperation } from '../game-categories-request-operation';
import { createEmptyRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { GameCategoryModel } from '../../../domain/models/game-category.model';

export const GameCategoriesGetAllActions = createEmptyRequestActions<
  { readonly categories: ReadonlyArray<GameCategoryModel> },
  { readonly error: RequestError }
>(GAME_CATEGORIES_STATE_DEFINITION.source, GameCategoriesRequestOperation.Load);
