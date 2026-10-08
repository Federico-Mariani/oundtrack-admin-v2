import type { AuthErrorCode } from '../../domain/errors/auth-error';

/**
 * Maps a semantic {@link AuthErrorCode} to a Transloco key relative to the
 * `auth` scope (e.g. `errors.invalidCredentials` resolves to
 * `auth.errors.invalidCredentials`).
 *
 * Translation stays in the presentation layer: the domain/application keep the
 * code, presentation turns it into a localized message. Keeping the mapping in
 * one place means a JSON structure change only touches this file.
 */
const AUTH_ERROR_TRANSLATION_KEYS: Record<AuthErrorCode, string> = {
  'invalid-credentials': 'errors.invalidCredentials',
  'email-already-registered': 'errors.emailAlreadyRegistered',
  validation: 'errors.validation',
  unauthorized: 'errors.unauthorized',
  network: 'errors.network',
  unknown: 'errors.unknown',
};

export function authErrorTranslationKey(code: AuthErrorCode): string {
  return AUTH_ERROR_TRANSLATION_KEYS[code];
}
