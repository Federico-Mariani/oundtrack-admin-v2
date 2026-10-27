import type { UserProfileModel } from '../../domain/models/user-profile.model';
import type { UserProfileResponseDto } from '../api/dto/user-profile-response.dto';
import { toProfileAvatar } from './profile-avatar.mapper';

export function toUserProfile(dto: UserProfileResponseDto): UserProfileModel {
  return {
    id: dto.id,
    isOnline: dto.isOnline,
    blocked: dto.blocked,
    avatar: dto.avatar ? toProfileAvatar(dto.avatar) : undefined,
    coins: dto.coins,
    lives: dto.lives,
  };
}
