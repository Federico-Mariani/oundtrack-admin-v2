import type { TokensResponseDto } from '../api/dto/tokens-response.dto';
import { toAuthSession } from './auth-session.mapper';

function fakeJwt(payload: Record<string, unknown>): string {
  const encoded = btoa(JSON.stringify(payload))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `header.${encoded}.signature`;
}

describe('toAuthSession', () => {
  const now = 1_700_000_000_000;

  it('uses the JWT exp claim when the token can be decoded', () => {
    const dto: TokensResponseDto = {
      accessToken: fakeJwt({ exp: 1_700_000_300 }),
      expiresIn: 60,
      refreshToken: fakeJwt({ exp: 1_700_001_000 }),
      refreshExpiresIn: 60,
    };

    const session = toAuthSession(dto, now);

    expect(session.accessTokenExpiresAt).toBe(1_700_000_300_000);
    expect(session.refreshTokenExpiresAt).toBe(1_700_001_000_000);
  });

  it('falls back to expiresIn for opaque tokens', () => {
    const dto: TokensResponseDto = {
      accessToken: 'opaque-access',
      expiresIn: 60,
      refreshToken: 'opaque-refresh',
      refreshExpiresIn: 3600,
    };

    const session = toAuthSession(dto, now);

    expect(session.accessToken).toBe('opaque-access');
    expect(session.accessTokenExpiresAt).toBe(now + 60_000);
    expect(session.refreshToken).toBe('opaque-refresh');
    expect(session.refreshTokenExpiresAt).toBe(now + 3_600_000);
  });
});
