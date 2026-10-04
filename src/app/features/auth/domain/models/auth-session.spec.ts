import { type AuthSession, isAccessTokenExpired } from './auth-session';

describe('isAccessTokenExpired', () => {
  const now = 1_000_000;

  const sessionExpiringAt = (accessTokenExpiresAt: number): AuthSession => ({
    accessToken: 'access',
    accessTokenExpiresAt,
    refreshToken: 'refresh',
    refreshTokenExpiresAt: accessTokenExpiresAt + 10_000,
  });

  it('returns false while the access token is still valid', () => {
    expect(isAccessTokenExpired(sessionExpiringAt(now + 1), now)).toBe(false);
  });

  it('returns true once the expiration instant is reached', () => {
    expect(isAccessTokenExpired(sessionExpiringAt(now), now)).toBe(true);
  });

  it('returns true after the expiration instant', () => {
    expect(isAccessTokenExpired(sessionExpiringAt(now - 1), now)).toBe(true);
  });
});
