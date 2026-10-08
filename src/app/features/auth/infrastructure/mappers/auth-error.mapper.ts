import { type HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import type { ApiErrorBody } from '@app/core/http/api-response';
import type { AuthError, AuthErrorCode } from '../../domain/errors/auth-error';

/** Endpoint that failed; the same HTTP status means different things per operation. */
export type AuthApiOperation = 'login' | 'register' | 'current-user';

export function toAuthError(response: HttpErrorResponse, operation: AuthApiOperation): AuthError {
  const body = toApiErrorBody(response.error);

  return {
    code: toAuthErrorCode(response.status, operation),
    message: body?.message ?? response.message,
    fieldErrors: body?.fields,
  };
}

/** `HttpErrorResponse.error` is untyped: accept it only when it looks like our error envelope. */
function toApiErrorBody(error: unknown): ApiErrorBody | null {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const candidate: Partial<Record<keyof ApiErrorBody, unknown>> = error;
  const message = typeof candidate.message === 'string' ? candidate.message : undefined;
  const fields = isStringArrayRecord(candidate.fields) ? candidate.fields : undefined;

  return { message, fields };
}

function isStringArrayRecord(value: unknown): value is Readonly<Record<string, readonly string[]>> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every(
      (entry) => Array.isArray(entry) && entry.every((item) => typeof item === 'string'),
    )
  );
}

/** Status of a request that never reached the server (CORS, offline, timeout). */
const NO_RESPONSE = 0;
const UNAUTHORIZED: number = HttpStatusCode.Unauthorized;
const CONFLICT: number = HttpStatusCode.Conflict;
const BAD_REQUEST: number = HttpStatusCode.BadRequest;
const UNPROCESSABLE_ENTITY: number = HttpStatusCode.UnprocessableEntity;

function toAuthErrorCode(status: number, operation: AuthApiOperation): AuthErrorCode {
  switch (status) {
    case NO_RESPONSE:
      return 'network';
    case UNAUTHORIZED:
      return operation === 'login' ? 'invalid-credentials' : 'unauthorized';
    case CONFLICT:
      return operation === 'register' ? 'email-already-registered' : 'unknown';
    case BAD_REQUEST:
    case UNPROCESSABLE_ENTITY:
      return 'validation';
    default:
      return 'unknown';
  }
}
