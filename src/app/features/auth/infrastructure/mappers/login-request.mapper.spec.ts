import { toLoginRequestDto } from './login-request.mapper';

describe('toLoginRequestDto', () => {
  it('sends the email as username', () => {
    expect(toLoginRequestDto({ email: 'a@b.c', password: 'secret' })).toEqual({
      username: 'a@b.c',
      password: 'secret',
    });
  });
});
