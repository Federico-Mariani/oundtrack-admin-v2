import type { AvatarModel } from '../../domain/models/avatar.model';
import type { AvatarResponseDto } from '../api/avatar-response.dto';
export function toAvatar(dto: AvatarResponseDto): AvatarModel {
  return { id: dto.id, path: dto.path, createdAt: dto.createdAt, updatedAt: dto.updatedAt };
}
