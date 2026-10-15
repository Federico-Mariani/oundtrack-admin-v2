import { GAME_CATEGORIES_PATHS } from './game-categories.paths';

export const GAME_CATEGORIES_NAVIGATION = {
  root: () => ['/', GAME_CATEGORIES_PATHS.root] as const,
} as const;
