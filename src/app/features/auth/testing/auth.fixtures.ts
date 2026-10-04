import type { AuthError, AuthErrorCode } from '../domain/errors/auth-error';
import type { AuthSession } from '../domain/models/auth-session';
import type { LoginCredentials } from '../domain/models/login-credentials';
import type { RegistrationData } from '../domain/models/registration-data';
import type { User } from '../domain/models/user';

const ONE_MINUTE_MS = 60_000;

export const TEST_USER: User = {
  id: '1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
};

export const TEST_CREDENTIALS: LoginCredentials = {
  email: TEST_USER.email,
  password: 'secret',
};

export const TEST_REGISTRATION: RegistrationData = {
  firstName: TEST_USER.firstName,
  lastName: TEST_USER.lastName,
  email: TEST_USER.email,
  password: 'secret',
};

export function sessionExpiringAt(accessTokenExpiresAt: number): AuthSession {
  return {
    accessToken: 'access',
    accessTokenExpiresAt,
    refreshToken: 'refresh',
    refreshTokenExpiresAt: accessTokenExpiresAt + ONE_MINUTE_MS,
  };
}

export function validSession(now: number = Date.now()): AuthSession {
  return sessionExpiringAt(now + ONE_MINUTE_MS);
}

export function expiredSession(now: number = Date.now()): AuthSession {
  return sessionExpiringAt(now - ONE_MINUTE_MS);
}

export function authError(code: AuthErrorCode): AuthError {
  return { code, message: code };
}
