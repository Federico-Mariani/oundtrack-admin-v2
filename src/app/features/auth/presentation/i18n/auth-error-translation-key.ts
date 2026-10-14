import type { RequestErrorCode } from '@shared/state/request/request-error';

export type AuthErrorOperation = 'login';

export function authErrorTranslationKey(
  operation: AuthErrorOperation,
  code: RequestErrorCode,
): string {
  return `errors.${operation}.${code}`;
}
