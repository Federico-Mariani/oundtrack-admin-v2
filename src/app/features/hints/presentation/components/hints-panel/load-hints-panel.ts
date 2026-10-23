import type { Type } from '@angular/core';
import type { HintsPanel } from './hints-panel';
let pending: Promise<Type<HintsPanel>> | undefined;
export function loadHintsPanel(): Promise<Type<HintsPanel>> {
  pending ??= import('./hints-panel')
    .then((module) => module.HintsPanel)
    .catch((error: unknown) => {
      pending = undefined;
      throw error;
    });
  return pending;
}
