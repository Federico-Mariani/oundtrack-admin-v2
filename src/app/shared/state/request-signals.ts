import { computed, type Signal } from '@angular/core';
import type { RequestState } from './request/request-state';

export interface RequestSignals<E> {
  readonly status: Signal<RequestState<E>['status']>;
  readonly isIdle: Signal<boolean>;
  readonly isLoading: Signal<boolean>;
  readonly isSuccess: Signal<boolean>;
  readonly isError: Signal<boolean>;
  readonly error: Signal<E | null>;
}

export function createRequestSignals<E>(request: Signal<RequestState<E>>): RequestSignals<E> {
  return {
    status: computed(() => request().status),
    isIdle: computed(() => request().status === 'idle'),
    isLoading: computed(() => request().status === 'pending'),
    isSuccess: computed(() => request().status === 'success'),
    isError: computed(() => request().status === 'error'),
    error: computed(() => request().error),
  };
}
