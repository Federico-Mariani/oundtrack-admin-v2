import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { NotificationService } from '@app/core/notifications/notification.service';
import type { AuthFeedbackPort } from '../../application/ports/auth-feedback.port';
import {
  type AuthErrorOperation,
  authErrorTranslationKey,
} from '../i18n/auth-error-translation-key';
import type { RequestError } from '@shared/state/request/request-error';

/**
 * Presentation adapter implementing {@link AuthFeedbackPort}.
 *
 * It owns the translation of auth outcomes (which is a presentation concern):
 * it maps the semantic {@link RequestError} code to a Transloco key, resolves the
 * localized text and surfaces it through the application-wide
 * {@link NotificationService}. The application side only knows the port.
 */
@Injectable({ providedIn: 'root' })
export class AuthFeedbackService implements AuthFeedbackPort {
  private readonly transloco = inject(TranslocoService);
  private readonly notifications = inject(NotificationService);

  loginFailed(error: RequestError): void {
    this.showError('login', error);
  }

  private showError(operation: AuthErrorOperation, error: RequestError): void {
    const key = authErrorTranslationKey(operation, error.code);

    this.notifications.error(this.transloco.translate(key));
  }
}
