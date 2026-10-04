import { InjectionToken } from '@angular/core';
import type { AccessTokenProvider } from '../ports/access-token-provider';

export const ACCESS_TOKEN_PROVIDER = new InjectionToken<AccessTokenProvider>(
  'ACCESS_TOKEN_PROVIDER',
);
