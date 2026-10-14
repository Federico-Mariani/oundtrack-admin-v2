/** `data` payload returned by `POST /login` and `POST /register`. */
export interface TokensResponseDto {
  readonly accessToken: string;
  /** Access token lifetime in seconds. */
  readonly expiresIn?: number;
  readonly refreshToken: string;
  /** Refresh token lifetime in seconds. */
  readonly refreshExpiresIn?: number;
}
