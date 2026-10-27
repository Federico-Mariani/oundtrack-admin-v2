import type { Id } from '@shared/types/id';
import type { ProfileAvatarResponseDto } from './profile-avatar-response.dto';

export interface UserProfileResponseDto {
  readonly id: Id;
  readonly isOnline: boolean;
  readonly blocked: boolean;
  readonly avatar?: ProfileAvatarResponseDto;
  readonly coins: number;
  readonly lives: number;
}
