import { HttpStatusCode } from '@angular/common/http';

import type { ApiErrorCode } from './api-error-code';

const NETWORK_ERROR_STATUS = 0;

const BAD_REQUEST_STATUS: number = HttpStatusCode.BadRequest;

const UNAUTHORIZED_STATUS: number = HttpStatusCode.Unauthorized;

const FORBIDDEN_STATUS: number = HttpStatusCode.Forbidden;

const NOT_FOUND_STATUS: number = HttpStatusCode.NotFound;

const CONFLICT_STATUS: number = HttpStatusCode.Conflict;

const UNPROCESSABLE_ENTITY_STATUS: number = HttpStatusCode.UnprocessableEntity;

const INTERNAL_SERVER_ERROR_STATUS: number = HttpStatusCode.InternalServerError;

export function resolveApiErrorCode(status: number): ApiErrorCode {
  switch (status) {
    case NETWORK_ERROR_STATUS:
      return 'network';

    case BAD_REQUEST_STATUS:
      return 'bad-request';

    case UNAUTHORIZED_STATUS:
      return 'unauthorized';

    case FORBIDDEN_STATUS:
      return 'forbidden';

    case NOT_FOUND_STATUS:
      return 'not-found';

    case CONFLICT_STATUS:
      return 'conflict';

    case UNPROCESSABLE_ENTITY_STATUS:
      return 'validation';

    default:
      return status >= INTERNAL_SERVER_ERROR_STATUS ? 'server' : 'unknown';
  }
}
