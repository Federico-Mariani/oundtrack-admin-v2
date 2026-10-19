import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { NotificationService } from '@app/core/notifications/notification.service';
import type { RequestError } from '@shared/state/request/request-error';
import type { TvSeriesFeedbackPort } from '../../application/ports/tv-series-feedback.port';
import {
  type TvSeriesErrorOperation,
  tvSeriesErrorTranslationKey,
} from '../i18n/tv-series-error-translation-key';

@Injectable({ providedIn: 'root' })
export class TvSeriesFeedbackService implements TvSeriesFeedbackPort {
  private readonly transloco = inject(TranslocoService);
  private readonly notifications = inject(NotificationService);

  createInfoSucceeded(): void {
    this.notifications.success(this.transloco.translate('tvSeries.createInfo.success'));
  }
  createInfoFailed(error: RequestError): void {
    this.notifications.error(this.transloco.translate(`tvSeries.createInfo.errors.${error.code}`));
  }
  createTvSeriesSucceeded(): void {
    this.notifications.success(this.transloco.translate('tvSeries.create.success'));
  }
  createTvSeriesFailed(error: RequestError): void {
    this.notifications.error(this.transloco.translate(`tvSeries.create.errors.${error.code}`));
  }
  getAllTvSeriesFailed(error: RequestError): void {
    this.showError('get-all', error);
  }

  private showError(operation: TvSeriesErrorOperation, error: RequestError): void {
    const key = tvSeriesErrorTranslationKey(operation, error.code);

    this.notifications.error(this.transloco.translate(key));
  }
}
