import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { hintsFeature } from './application/state/hints.feature';
import * as effects from './application/state/effects/hints.effects';
import { HINTS_REPOSITORY } from './application/tokens/hints-repository.token';
import { HttpHintsRepository } from './infrastructure/repositories/http-hints.repository';
export function provideHints(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(hintsFeature),
    provideEffects(effects),
    { provide: HINTS_REPOSITORY, useClass: HttpHintsRepository },
  ]);
}
