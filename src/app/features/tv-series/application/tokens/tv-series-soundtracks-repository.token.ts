import { InjectionToken } from '@angular/core';
import type { TvSeriesSoundtracksRepositoryPort } from '../ports/tv-series-soundtracks-repository.port';

export const TV_SERIES_SOUNDTRACKS_REPOSITORY =
  new InjectionToken<TvSeriesSoundtracksRepositoryPort>('TV_SERIES_SOUNDTRACKS_REPOSITORY');
