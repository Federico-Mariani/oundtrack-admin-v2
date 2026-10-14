import { AUTH_I18N_SCOPE } from './auth-translations.loader';
import type { RequestErrorCode } from '@shared/state/request/request-error';

export type AuthErrorOperation = 'login';

export function authErrorTranslationKey(
  operation: AuthErrorOperation,
  code: RequestErrorCode,
): string {
  return `${AUTH_I18N_SCOPE}.errors.${operation}.${code}`;
}
