import type { ValidationError } from '@angular/forms/signals';

/**
 * Field-scoped validation errors coming from a backend API, keyed by the model
 * property they belong to. Every property carries one or more human-readable
 * messages.
 *
 * This is the transport-agnostic shape every feature maps its server errors to
 * before surfacing them on an input, so the same mechanism works across the
 * whole project.
 */
export type ServerFieldErrors = Readonly<Record<string, readonly string[]>>;

/** Error `kind` shared by every server-originated field error. */
const SERVER_VALIDATION_ERROR_KIND = 'server';

/**
 * Reads the API error messages for a single field and turns them into
 * `ValidationError`s, so they can be surfaced on the field exactly like the
 * client-side validation errors.
 *
 * Returns an empty array when there is no error for the field, which makes it
 * safe to return directly from a reactive form validator or a `computed()`.
 *
 * @param fieldErrors The API field errors, keyed by model property (may be absent).
 * @param fieldName The model property to read the messages for.
 */
export function serverFieldErrors(
  fieldErrors: ServerFieldErrors | null | undefined,
  fieldName: string,
): ValidationError.WithoutFieldTree[] {
  const messages = fieldErrors?.[fieldName] ?? [];

  return messages.map((message) => ({ kind: SERVER_VALIDATION_ERROR_KIND, message }));
}
