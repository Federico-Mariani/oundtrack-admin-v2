import { InjectionToken } from '@angular/core';
import type { TvSeriesRepositoryPort } from '../ports/tv-series-repository.port';

export const TV_SERIES_REPOSITORY = new InjectionToken<TvSeriesRepositoryPort>(
  'TV_SERIES_REPOSITORY',
);
