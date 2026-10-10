import { InjectionToken } from '@angular/core';
import type { MoviesRepositoryPort } from '../ports/movies-repository.port';

export const MOVIES_REPOSITORY = new InjectionToken<MoviesRepositoryPort>('MOVIES_REPOSITORY');
