import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { NotificationService } from '@app/core/notifications/notification.service';
import type { MoviesFeedbackPort } from '../../application/ports/movies-feedback.port';
import {
  type MoviesErrorOperation,
  moviesErrorTranslationKey,
} from '../i18n/movies-error-translation-key';
import type { RequestError } from '@shared/state/request/request-error';

/**
 * Presentation adapter implementing {@link MoviesFeedbackPort}.
 *
 * It owns the translation of auth outcomes (which is a presentation concern):
 * it maps the semantic {@link MoviesError} code to a Transloco key, resolves the
 * localized text and surfaces it through the application-wide
 * {@link NotificationService}. The application side only knows the port.
 */
@Injectable({ providedIn: 'root' })
export class MoviesFeedbackService implements MoviesFeedbackPort {
  private readonly transloco = inject(TranslocoService);
  private readonly notifications = inject(NotificationService);

  createInfoSucceeded(): void {
    this.notifications.success(this.transloco.translate('movies.createInfo.success'));
  }
  createInfoFailed(error: RequestError): void {
    this.notifications.error(this.transloco.translate(`movies.createInfo.errors.${error.code}`));
  }
  createMovieSucceeded(): void {
    this.notifications.success(this.transloco.translate('movies.create.success'));
  }
  createMovieFailed(error: RequestError): void {
    this.notifications.error(this.transloco.translate(`movies.create.errors.${error.code}`));
  }
  loadMoviesFailed(error: RequestError): void {
    this.showError('get-all', error);
  }

  private showError(operation: MoviesErrorOperation, error: RequestError): void {
    const key = moviesErrorTranslationKey(operation, error.code);

    this.notifications.error(this.transloco.translate(key));
  }
}
