import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AVATARS_REPOSITORY } from './application/tokens/avatars-repository.token';
import { HttpAvatarsRepository } from './infrastructure/repositories/http-avatars.repository';
import { avatarsFeature } from './application/state/avatars.feature';
import * as loadEffects from './application/state/effects/avatars-load.effects';
import * as saveEffects from './application/state/effects/avatar-save.effects';
export function provideAvatars(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: AVATARS_REPOSITORY, useClass: HttpAvatarsRepository },
    provideState(avatarsFeature),
    provideEffects(loadEffects, saveEffects),
  ]);
}
