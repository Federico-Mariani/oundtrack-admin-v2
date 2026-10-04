import type { RequestState } from './request-state';

/**
 * Pure transitions of a `RequestState`. Each one returns a fresh value so
 * reducers can write `loginRequest: pendingRequest()` without spreading the
 * previous request or clearing its error by hand. The error type is inferred
 * from the target `RequestState<E>` (or given explicitly) — never defaulted.
 */
export function idleRequest<E>(): RequestState<E> {
  return { status: 'idle', error: null };
}

export function pendingRequest<E>(): RequestState<E> {
  return { status: 'pending', error: null };
}

export function succeededRequest<E>(): RequestState<E> {
  return { status: 'success', error: null };
}

export function failedRequest<E>(error: E): RequestState<E> {
  return { status: 'error', error };
}
