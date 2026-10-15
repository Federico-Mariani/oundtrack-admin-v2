import type { RequestErrorCode } from '@shared/state/request/request-error';
import { GAME_CATEGORIES_I18N_SCOPE } from './game-categories-translations.loader';

export type GameCategoriesErrorOperation = 'get-all';

export function gameCategoriesErrorTranslationKey(
  operation: GameCategoriesErrorOperation,
  code: RequestErrorCode,
): string {
  return `${GAME_CATEGORIES_I18N_SCOPE}.${operation}.${code}`;
}
