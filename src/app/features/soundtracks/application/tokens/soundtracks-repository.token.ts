import { InjectionToken } from '@angular/core';
import type { SoundtracksRepositoryPort } from '../ports/soundtracks-repository.port';

export const SOUNDTRACKS_REPOSITORY = new InjectionToken<SoundtracksRepositoryPort>(
  'SOUNDTRACKS_REPOSITORY',
);
