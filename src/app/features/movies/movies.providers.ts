import * as moviesAudioEffects from './application/state/effects/movies-audio.effects';
import { MOVIE_SOUNDTRACKS_REPOSITORY } from './application/tokens/movie-soundtracks-repository.token';
import { HttpMovieSoundtracksRepository } from './infrastructure/repositories/http-movie-soundtracks.repository';
import * as moviesInfoCreateEffects from './application/state/effects/movies-info-create.effects';
import * as moviesInfoCreateFeedbackEffects from './application/state/effects/feedback/movies-info-create-feedback.effects';
import * as moviesCreateEffect from './application/state/effects/movies-create.effects';
import * as moviesCreateFeedbackEffect from './application/state/effects/feedback/movies-create-feedback.effects';
import * as moviesDetailEffects from './application/state/effects/movies-detail.effects';
import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { moviesFeature } from './application/state/movies.feature';
import { MOVIES_REPOSITORY } from './application/tokens/movies-repository.token';
import { HttpMoviesRepository } from './infrastructure/repositories/http-movies.repository';
import * as moviesLoadEffect from './application/state/effects/movies-load.effects';
import * as moviesLoadFeedbackEffect from './application/state/effects/feedback/movies-load-feedback.effects';
import { MoviesFeedbackService } from './presentation/notifications/movies-feedback.service';
import { MOVIES_FEEDBACK_PORT } from './application/tokens/movies-feedback.token';

export function provideMovies(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MOVIE_SOUNDTRACKS_REPOSITORY, useClass: HttpMovieSoundtracksRepository },
    { provide: MOVIES_REPOSITORY, useClass: HttpMoviesRepository },
    {
      provide: MOVIES_FEEDBACK_PORT,
      useExisting: MoviesFeedbackService,
    },
    provideState(moviesFeature),
    provideEffects(
      moviesAudioEffects,
      moviesInfoCreateEffects,
      moviesInfoCreateFeedbackEffects,
      moviesDetailEffects,
      moviesLoadEffect,
      moviesLoadFeedbackEffect,
      moviesCreateEffect,
      moviesCreateFeedbackEffect,
    ),
  ]);
}
