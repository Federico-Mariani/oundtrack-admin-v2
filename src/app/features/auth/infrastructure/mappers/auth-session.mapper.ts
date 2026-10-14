import { jwtDecode } from 'jwt-decode';
import type { AuthSessionModel } from '../../domain/models/auth-session.model';
import type { TokensResponseDto } from '../api/dto/tokens-response.dto';

const MILLISECONDS_PER_SECOND = 1000;

/**
 * The JWT `exp` claim is the authoritative expiration; `expiresIn` is used only
 * when the token cannot be decoded (e.g. opaque tokens).
 */
export function toAuthSession(dto: TokensResponseDto, now: number = Date.now()): AuthSessionModel {
  const session = {
    accessToken: dto.accessToken,
    accessTokenExpiresAt:
      jwtExpirationMs(dto.accessToken) ?? now + (dto.expiresIn ?? 0) * MILLISECONDS_PER_SECOND,
    refreshToken: dto.refreshToken,
    refreshTokenExpiresAt:
      jwtExpirationMs(dto.refreshToken) ??
      now + (dto.refreshExpiresIn ?? 0) * MILLISECONDS_PER_SECOND,
  };
  if (
    !session.accessToken ||
    !session.refreshToken ||
    !Number.isFinite(session.accessTokenExpiresAt) ||
    !Number.isFinite(session.refreshTokenExpiresAt) ||
    session.accessTokenExpiresAt <= now ||
    session.refreshTokenExpiresAt <= now
  ) {
    throw new Error('Invalid authentication token response');
  }
  return session;
}

function jwtExpirationMs(token: string): number | null {
  try {
    const { exp } = jwtDecode(token);
    return exp ? exp * MILLISECONDS_PER_SECOND : null;
  } catch {
    return null;
  }
}
