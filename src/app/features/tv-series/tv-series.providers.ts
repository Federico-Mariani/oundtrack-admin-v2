import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as tvSeriesInfoCreateEffects from './application/state/effects/tv-series-info-create.effects';
import * as tvSeriesInfoCreateFeedbackEffects from './application/state/effects/feedback/tv-series-info-create-feedback.effects';
import * as tvSeriesDetailEffects from './application/state/effects/tv-series-detail.effects';
import * as tvSeriesCreateEffect from './application/state/effects/tv-series-create.effects';
import * as tvSeriesGetAllEffect from './application/state/effects/tv-series-get-all.effects';
import * as tvSeriesGetAllFeedbackEffect from './application/state/effects/feedback/tv-series-get-all-feedback.effects';
import * as tvSeriesCreateFeedbackEffect from './application/state/effects/feedback/tv-series-create-feedback.effects';
import { tvSeriesFeature } from './application/state/tv-series.feature';
import { TV_SERIES_REPOSITORY } from './application/tokens/tv-series-repository.token';
import { TV_SERIES_FEEDBACK_PORT } from './application/tokens/tv-series-feedback.token';
import { HttpTvSeriesRepository } from './infrastructure/repositories/http-tv-series.repository';
import { TvSeriesFeedbackService } from './presentation/notifications/tv-series-feedback.service';

export function provideTvSeries(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TV_SERIES_REPOSITORY, useClass: HttpTvSeriesRepository },
    {
      provide: TV_SERIES_FEEDBACK_PORT,
      useExisting: TvSeriesFeedbackService,
    },
    provideState(tvSeriesFeature),
    provideEffects(
      tvSeriesInfoCreateEffects,
      tvSeriesInfoCreateFeedbackEffects,
      tvSeriesDetailEffects,
      tvSeriesGetAllEffect,
      tvSeriesGetAllFeedbackEffect,
      tvSeriesCreateEffect,
      tvSeriesCreateFeedbackEffect,
    ),
  ]);
}
