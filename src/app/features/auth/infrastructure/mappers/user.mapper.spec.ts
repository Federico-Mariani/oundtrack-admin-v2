import { toUser } from './user.mapper';

describe('toUser', () => {
  it('maps the response fields', () => {
    expect(toUser({ id: '1', firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.c' })).toEqual({
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'a@b.c',
    });
  });
});
