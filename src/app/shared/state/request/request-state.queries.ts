import type { RequestState } from './request-state';

/**
 * Pure queries over a `RequestState`, meant to be used as selector projectors:
 * `createSelector(selectLoginRequest, isRequestPending)`.
 */
export function isRequestPending(request: RequestState<unknown>): boolean {
  return request.status === 'pending';
}

export function requestError<E>(request: RequestState<E>): E | null {
  return request.error;
}
