import type { Id } from '@shared/types/id';
import type { ProfileAvatarModel } from './profile-avatar.model';

export interface UserProfileModel {
  readonly id: Id;
  readonly isOnline: boolean;
  readonly blocked: boolean;
  readonly avatar?: ProfileAvatarModel;
  readonly coins: number;
  readonly lives: number;
}
