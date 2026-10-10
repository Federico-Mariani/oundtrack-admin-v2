import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { moviesFeature } from './application/state/movies.feature';
import { MOVIES_REPOSITORY } from './application/tokens/movies-repository.token';
import { HttpMoviesRepository } from './infrastructure/repositories/http-movies.repository';
import * as moviesLoadEffect from './application/state/effects/movies-load.effects';
import * as moviesLoadFeedbackEffect from './application/state/effects/movies-load-feedback.effects';
import { MoviesFeedbackService } from './presentation/notifications/movies-feedback.service';
import { MOVIES_FEEDBACK_PORT } from './application/tokens/movies-feedback.token';

export function provideMovies(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MOVIES_REPOSITORY, useClass: HttpMoviesRepository },
    {
      provide: MOVIES_FEEDBACK_PORT,
      useExisting: MoviesFeedbackService,
    },
    provideState(moviesFeature),
    provideEffects(moviesLoadEffect, moviesLoadFeedbackEffect),
  ]);
}
