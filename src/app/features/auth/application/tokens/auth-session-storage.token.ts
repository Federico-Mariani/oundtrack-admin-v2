import { InjectionToken } from '@angular/core';
import type { AuthSessionStoragePort } from '../ports/auth-session-storage.port';

export const AUTH_SESSION_STORAGE = new InjectionToken<AuthSessionStoragePort>(
  'AUTH_SESSION_STORAGE',
);
