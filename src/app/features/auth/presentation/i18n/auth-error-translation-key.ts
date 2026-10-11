import type { RequestErrorCode } from '@shared/state/request/request-error';
import { AUTH_I18N_SCOPE } from './auth-translations.loader';

export type AuthErrorOperation = 'login';

export function authErrorTranslationKey(
  operation: AuthErrorOperation,
  code: RequestErrorCode,
): string {
  return `${AUTH_I18N_SCOPE}.${operation}.${code}`;
}
