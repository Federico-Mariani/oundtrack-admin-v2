import {
  SERVER_VALIDATION_ERROR_KIND,
  type ServerFieldErrors,
  serverFieldErrors,
} from './server-field-errors';

describe('serverFieldErrors', () => {
  const fieldErrors: ServerFieldErrors = {
    email: ['Email already taken'],
    password: ['Too short', 'Too weak'],
  };

  it('maps every message of a field to a server validation error', () => {
    expect(serverFieldErrors(fieldErrors, 'password')).toEqual([
      { kind: SERVER_VALIDATION_ERROR_KIND, message: 'Too short' },
      { kind: SERVER_VALIDATION_ERROR_KIND, message: 'Too weak' },
    ]);
  });

  it('returns an empty array when the field has no error', () => {
    expect(serverFieldErrors(fieldErrors, 'username')).toEqual([]);
  });

  it('returns an empty array when there are no field errors at all', () => {
    expect(serverFieldErrors(null, 'email')).toEqual([]);
    expect(serverFieldErrors(undefined, 'email')).toEqual([]);
  });
});
