/**
 * Authenticated session issued by the backend.
 * Expiration instants are absolute epoch milliseconds so the session can be
 * persisted and evaluated later without re-decoding tokens.
 */
export interface AuthSession {
  readonly accessToken: string;
  readonly accessTokenExpiresAt: number;
  readonly refreshToken: string;
  readonly refreshTokenExpiresAt: number;
}

export function isAccessTokenExpired(session: AuthSession, now: number = Date.now()): boolean {
  return session.accessTokenExpiresAt <= now;
}
