/**
 * Public API of the Movies feature.
 * Other features and the app shell must import from here only;
 * everything else inside `features/game-categories` is an implementation detail.
 */
export { GameCategoriesFacade } from './application/state/facades/game-categories.facade';
export { provideGameCategories } from './game-categories.providers';
