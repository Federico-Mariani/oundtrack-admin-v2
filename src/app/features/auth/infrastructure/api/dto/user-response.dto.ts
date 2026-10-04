import type { Id } from '@shared/types/id';

/** `data` payload returned by `GET /me`. */
export interface UserResponseDto {
  readonly id: Id;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}
