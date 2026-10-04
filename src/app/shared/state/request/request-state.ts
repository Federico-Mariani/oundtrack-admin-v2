import type { RequestStatus } from './request-status';

/**
 * Lifecycle of one async operation: status plus the error of the last failure.
 * Features compose one `RequestState` per operation in their own state, so
 * independent requests can be pending at the same time. Pure TypeScript:
 * knows nothing about Angular, NgRx or any feature.
 *
 * The error type has no default on purpose: every feature must state which
 * error it models (`RequestState<AuthError>`); use `RequestState<never>` for an
 * operation that cannot fail.
 */
export interface RequestState<E> {
  readonly status: RequestStatus;
  readonly error: E | null;
}
