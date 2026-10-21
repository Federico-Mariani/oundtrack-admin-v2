import { InjectionToken } from '@angular/core';
import type { HintsRepositoryPort } from '../ports/hints-repository.port';
export const HINTS_REPOSITORY = new InjectionToken<HintsRepositoryPort>('HintsRepository');
