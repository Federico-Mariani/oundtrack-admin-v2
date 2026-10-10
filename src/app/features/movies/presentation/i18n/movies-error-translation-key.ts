import type { RequestErrorCode } from '@shared/state/request/request-error';
import { MOVIES_I18N_SCOPE } from './movies-translations.loader';

export type MoviesErrorOperation = 'get-all';

export function moviesErrorTranslationKey(
  operation: MoviesErrorOperation,
  code: RequestErrorCode,
): string {
  return `${MOVIES_I18N_SCOPE}.${operation}.${code}`;
}
