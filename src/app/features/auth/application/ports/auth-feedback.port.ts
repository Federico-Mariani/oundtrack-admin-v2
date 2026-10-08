import type { AuthError } from '../../domain/errors/auth-error';

/**
 * Port towards user feedback for auth outcomes, consumed by the application
 * effects and bound to a presentation adapter in `auth.providers.ts`.
 *
 * The application only knows this contract: it must never depend on Spartan,
 * Transloco or any presentation detail. The adapter (presentation) turns the
 * semantic `AuthError` into a localized message and shows it through the
 * application-wide notification capability.
 */
export interface AuthFeedbackPort {
  loginFailed(error: AuthError): void;
}
