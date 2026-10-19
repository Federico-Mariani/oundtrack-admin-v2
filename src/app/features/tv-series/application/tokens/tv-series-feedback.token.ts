import { InjectionToken } from '@angular/core';
import type { TvSeriesFeedbackPort } from '../ports/tv-series-feedback.port';

export const TV_SERIES_FEEDBACK_PORT = new InjectionToken<TvSeriesFeedbackPort>(
  'TV_SERIES_FEEDBACK_PORT',
);
