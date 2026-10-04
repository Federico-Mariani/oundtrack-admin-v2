import { jwtDecode } from 'jwt-decode';
import type { AuthSession } from '../../domain/models/auth-session';
import type { TokensResponseDto } from '../api/dto/tokens-response.dto';

const MILLISECONDS_PER_SECOND = 1000;

/**
 * The JWT `exp` claim is the authoritative expiration; `expiresIn` is used only
 * when the token cannot be decoded (e.g. opaque tokens).
 */
export function toAuthSession(dto: TokensResponseDto, now: number = Date.now()): AuthSession {
  return {
    accessToken: dto.accessToken,
    accessTokenExpiresAt:
      jwtExpirationMs(dto.accessToken) ?? now + dto.expiresIn * MILLISECONDS_PER_SECOND,
    refreshToken: dto.refreshToken,
    refreshTokenExpiresAt:
      jwtExpirationMs(dto.refreshToken) ?? now + dto.refreshExpiresIn * MILLISECONDS_PER_SECOND,
  };
}

function jwtExpirationMs(token: string): number | null {
  try {
    const { exp } = jwtDecode(token);
    return exp ? exp * MILLISECONDS_PER_SECOND : null;
  } catch {
    return null;
  }
}
