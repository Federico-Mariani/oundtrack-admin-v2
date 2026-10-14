import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthTokenRefresh } from './auth-token-refresh';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const baseUrl = environment.apiUrl.replace(/\/$/, '');
  const path = request.url.split(/[?#]/)[0].replace(/\/+$/, '');
  if (
    !(path === baseUrl || path.startsWith(`${baseUrl}/`)) ||
    [`${baseUrl}/auth/sign-in`, `${baseUrl}/auth/sign-up`, `${baseUrl}/auth/refresh`].includes(path)
  ) {
    return next(request);
  }
  const refresh = inject(AuthTokenRefresh);
  const original = refresh.snapshot();
  if (!original.session) {
    return next(request);
  }
  const authorize = (token: string) =>
    request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(authorize(original.session.accessToken)).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }
      return refresh.recover(original).pipe(
        switchMap((session) =>
          next(authorize(session.accessToken)).pipe(
            catchError((retryError: unknown) => {
              if (
                retryError instanceof HttpErrorResponse &&
                retryError.status === 401 &&
                refresh.snapshot().session?.accessToken === session.accessToken
              ) {
                refresh.expire(original.generation);
              }
              return throwError(() => retryError);
            }),
          ),
        ),
      );
    }),
  );
};
