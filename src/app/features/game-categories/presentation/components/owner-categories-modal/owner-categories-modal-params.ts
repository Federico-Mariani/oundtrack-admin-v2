import type { GameCategoryOwner } from '../../../domain/values/game-category-owner';
export interface OwnerCategoriesModalParams {
  readonly owner: GameCategoryOwner;
  readonly categoryIds: ReadonlyArray<string>;
}
