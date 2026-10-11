import { InjectionToken } from '@angular/core';
import type { AccessTokenProviderPort } from '../ports/access-token-provider.port';

export const ACCESS_TOKEN_PROVIDER = new InjectionToken<AccessTokenProviderPort>(
  'ACCESS_TOKEN_PROVIDER',
);
