import type { ProfileAvatarResponseDto } from '../api/dto/profile-avatar-response.dto';
import type { ProfileAvatarModel } from '../../domain/models/profile-avatar.model';

export function toProfileAvatar(dto: ProfileAvatarResponseDto): ProfileAvatarModel {
  return {
    id: dto.id,
    path: dto.path,
  };
}
