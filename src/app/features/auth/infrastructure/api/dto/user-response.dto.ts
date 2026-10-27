import type { Id } from '@shared/types/id';
import type { UserProfileResponseDto } from './user-profile-response.dto';

/** `data` payload returned by `GET /me`. */
export interface UserResponseDto {
  readonly id: Id;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly profile: UserProfileResponseDto;
}
