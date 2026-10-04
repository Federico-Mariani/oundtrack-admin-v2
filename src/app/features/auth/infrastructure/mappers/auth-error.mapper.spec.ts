import { HttpErrorResponse } from '@angular/common/http';
import { toAuthError } from './auth-error.mapper';

describe('toAuthError', () => {
  const response = (status: number, error: unknown = null) =>
    new HttpErrorResponse({ status, error, statusText: 'x', url: '/x' });

  it('maps 401 on login to invalid-credentials', () => {
    expect(toAuthError(response(401), 'login').code).toBe('invalid-credentials');
  });

  it('maps 401 outside login to unauthorized', () => {
    expect(toAuthError(response(401), 'current-user').code).toBe('unauthorized');
  });

  it('maps 409 on register to email-already-registered', () => {
    expect(toAuthError(response(409), 'register').code).toBe('email-already-registered');
  });

  it('maps status 0 to network', () => {
    expect(toAuthError(response(0), 'login').code).toBe('network');
  });

  it('maps unexpected statuses to unknown', () => {
    expect(toAuthError(response(500), 'login').code).toBe('unknown');
  });

  it('prefers the backend message and exposes field errors', () => {
    const error = toAuthError(
      response(422, { message: 'Invalid', fields: { email: 'bad' } }),
      'register',
    );

    expect(error).toEqual({
      code: 'validation',
      message: 'Invalid',
      fieldErrors: { email: 'bad' },
    });
  });
});
