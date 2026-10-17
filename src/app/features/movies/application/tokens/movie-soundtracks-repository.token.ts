import { InjectionToken } from '@angular/core';
import type { MovieSoundtracksRepositoryPort } from '../ports/movie-soundtracks-repository.port';
export const MOVIE_SOUNDTRACKS_REPOSITORY = new InjectionToken<MovieSoundtracksRepositoryPort>(
  'MOVIE_SOUNDTRACKS_REPOSITORY',
);
