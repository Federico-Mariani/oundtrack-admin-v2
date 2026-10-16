import type { RequestStatus } from './request-status';

export type RequestState<E> =
  | { readonly status: Extract<RequestStatus, 'idle'>; readonly error: null }
  | { readonly status: Extract<RequestStatus, 'pending'>; readonly error: null }
  | { readonly status: Extract<RequestStatus, 'success'>; readonly error: null }
  | { readonly status: Extract<RequestStatus, 'error'>; readonly error: E };
