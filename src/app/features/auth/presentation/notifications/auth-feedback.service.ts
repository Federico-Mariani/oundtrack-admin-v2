import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { NotificationService } from '@app/core/notifications/notification.service';
import type { AuthError } from '../../domain/errors/auth-error';
import type { AuthFeedbackPort } from '../../application/ports/auth-feedback.port';
import { AUTH_I18N_SCOPE } from '../i18n/auth-translations.loader';
import { authErrorTranslationKey } from '../i18n/auth-error-translation-key';

/**
 * Presentation adapter implementing {@link AuthFeedbackPort}.
 *
 * It owns the translation of auth outcomes (which is a presentation concern):
 * it maps the semantic {@link AuthError} code to a Transloco key, resolves the
 * localized text and surfaces it through the application-wide
 * {@link NotificationService}. The application side only knows the port.
 */
@Injectable({ providedIn: 'root' })
export class AuthFeedbackService implements AuthFeedbackPort {
  private readonly transloco = inject(TranslocoService);
  private readonly notifications = inject(NotificationService);

  loginFailed(error: AuthError): void {
    const key = `${AUTH_I18N_SCOPE}.${authErrorTranslationKey(error.code)}`;
    this.notifications.error(this.transloco.translate(key));
  }
}
