/**
 * Public API of the Movies feature.
 * Other features and the app shell must import from here only;
 * everything else inside `features/game-categories` is an implementation detail.
 */
export { GameCategoriesFacade } from './application/state/facades/game-categories.facade';
export { provideGameCategories } from './game-categories.providers';
export { GAME_CATEGORIES_ROUTES } from './presentation/routing/game-categories.routes';
export { GAME_CATEGORIES_PATHS } from './presentation/routing/game-categories.paths';
export { GAME_CATEGORIES_NAVIGATION } from './presentation/routing/game-categories.navigation';

export { loadOwnerCategoriesModal } from './presentation/components/owner-categories-modal/load-owner-categories-modal';
export type { GameCategoryOwner } from './domain/values/game-category-owner';
