import { InjectionToken } from '@angular/core';
import type { AuthRefreshPort } from '../ports/auth-refresh.port';

export const AUTH_REFRESH = new InjectionToken<AuthRefreshPort>('AUTH_REFRESH');
