import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@environments/environment';
import { ACCESS_TOKEN_PROVIDER } from '../../application/tokens/access-token-provider.token';

/**
 * Attaches the bearer token to requests directed to our API.
 * Reads the token through the `AccessTokenProvider` port, so infrastructure
 * never depends on NgRx state or facades.
 */
export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(environment.apiUrl)) {
    return next(request);
  }

  const accessToken = inject(ACCESS_TOKEN_PROVIDER).accessToken();

  if (!accessToken) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    }),
  );
};
