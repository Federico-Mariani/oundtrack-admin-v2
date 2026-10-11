import { InjectionToken } from '@angular/core';
import type { AuthRepositoryPort } from '../ports/auth.repository.port';

export const AUTH_REPOSITORY = new InjectionToken<AuthRepositoryPort>('AUTH_REPOSITORY');
