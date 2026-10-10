import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { moviesFeature } from './application/state/movies.feature';
import { MOVIES_REPOSITORY } from './application/tokens/movies-repository.token';
import { HttpMoviesRepository } from './infrastructure/repositories/http-movies.repository';
import * as moviesLoadEffect from './application/state/effects/movies-load.effects';
import * as moviesLoadFeedbackEffect from './application/state/effects/movies-load-feedback.effects';

export function provideMovies(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MOVIES_REPOSITORY, useClass: HttpMoviesRepository },
    provideState(moviesFeature),
    provideEffects(moviesLoadEffect, moviesLoadFeedbackEffect),
  ]);
}
