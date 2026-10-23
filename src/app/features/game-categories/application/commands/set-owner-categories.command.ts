import type { GameCategoryOwner } from '../../domain/values/game-category-owner';
export interface SetOwnerCategoriesCommand {
  readonly owner: GameCategoryOwner;
  readonly categoryIds: ReadonlyArray<string>;
}
