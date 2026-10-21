import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { soundtracksFeature } from './application/state/soundtracks.feature';
import * as audioEffects from './application/state/effects/soundtracks-audio.effects';
import { SOUNDTRACKS_REPOSITORY } from './application/tokens/soundtracks-repository.token';
import { HttpSoundtracksRepository } from './infrastructure/repositories/http-soundtracks.repository';
export function provideSoundtracks(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(soundtracksFeature),
    provideEffects(audioEffects),
    { provide: SOUNDTRACKS_REPOSITORY, useClass: HttpSoundtracksRepository },
  ]);
}
