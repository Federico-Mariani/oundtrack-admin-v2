export type AuthErrorCode =
  | 'invalid-credentials'
  | 'email-already-registered'
  | 'validation'
  | 'unauthorized'
  | 'network'
  | 'unknown';

/**
 * Transport-agnostic failure of an auth operation.
 * Infrastructure is responsible for translating HTTP failures into this shape.
 */
export interface AuthError {
  readonly code: AuthErrorCode;
  readonly message: string;
  readonly fieldErrors?: Readonly<Record<string, readonly string[]>>;
}
