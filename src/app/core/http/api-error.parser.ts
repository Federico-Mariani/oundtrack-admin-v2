import type { ApiErrorBody } from './api-response';

export function parseApiErrorBody(value: unknown): ApiErrorBody | null {
  if (!isRecord(value)) {
    return null;
  }

  const message = typeof value['message'] === 'string' ? value['message'] : undefined;

  const fields = isFieldErrors(value['fields']) ? value['fields'] : undefined;

  return {
    message,
    fields,
  };
}

function isFieldErrors(value: unknown): value is Readonly<Record<string, readonly string[]>> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (errors) => Array.isArray(errors) && errors.every((error) => typeof error === 'string'),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
