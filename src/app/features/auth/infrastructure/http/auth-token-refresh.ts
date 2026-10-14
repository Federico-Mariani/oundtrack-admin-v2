import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  defer,
  filter,
  finalize,
  switchMap,
  type Observable,
  of,
  shareReplay,
  take,
  throwError,
} from 'rxjs';
import { AUTH_REFRESH } from '../../application/tokens/auth-refresh.token';
import type { AuthRefreshSnapshot } from '../../application/ports/auth-refresh.port';
import {
  type AuthSessionModel,
  isRefreshTokenExpired,
} from '../../domain/models/auth-session.model';

@Injectable()
export class AuthTokenRefresh {
  private readonly auth = inject(AUTH_REFRESH);
  private inFlight?: { generation: number; result: Observable<AuthSessionModel> };

  snapshot(): AuthRefreshSnapshot {
    return this.auth.snapshot();
  }

  expire(generation: number): void {
    this.auth.expire(generation);
  }

  recover(original: AuthRefreshSnapshot): Observable<AuthSessionModel> {
    return defer(() => {
      const current = this.auth.snapshot();
      if (!current.session || current.generation !== original.generation) {
        return throwError(() => new HttpErrorResponse({ status: 401 }));
      }
      if (current.session !== original.session) {
        return of(current.session);
      }
      if (isRefreshTokenExpired(current.session)) {
        this.expire(current.generation);
        return throwError(() => new HttpErrorResponse({ status: 401 }));
      }
      if (this.inFlight?.generation === current.generation) {
        return this.inFlight.result;
      }
      const operation = {
        generation: current.generation,
        result: defer(() => {
          this.auth.refresh(current.generation);
          return this.auth.changes$.pipe(
            filter(
              (state) =>
                state.generation !== current.generation ||
                state.request.status === 'success' ||
                state.request.status === 'error',
            ),
            take(1),
            switchMap((state) => {
              if (state.generation !== current.generation || !state.session) {
                return throwError(() => new HttpErrorResponse({ status: 401 }));
              }
              if (state.request.status === 'error') {
                const error = state.request.error;
                if (error?.code === 'unauthorized' || error?.code === 'forbidden') {
                  this.expire(current.generation);
                }
                return throwError(
                  () => new HttpErrorResponse({ status: error?.status ?? 500, error }),
                );
              }
              return of(state.session);
            }),
          );
        }).pipe(
          finalize(() => {
            if (this.inFlight === operation) {
              this.inFlight = undefined;
            }
          }),
          shareReplay({ bufferSize: 1, refCount: false }),
        ),
      };
      this.inFlight = operation;
      return operation.result;
    });
  }
}
