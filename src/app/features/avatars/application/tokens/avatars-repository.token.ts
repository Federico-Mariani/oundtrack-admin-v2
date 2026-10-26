import { InjectionToken } from '@angular/core';
import type { AvatarsRepositoryPort } from '../ports/avatars-repository.port';
export const AVATARS_REPOSITORY = new InjectionToken<AvatarsRepositoryPort>('AvatarsRepository');
