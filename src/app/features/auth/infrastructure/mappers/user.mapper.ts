import type { UserModel } from '../../domain/models/user.model';
import type { UserResponseDto } from '../api/dto/user-response.dto';
import { toUserProfile } from './user-profile.mapper';

export function toUser(dto: UserResponseDto): UserModel {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    profile: toUserProfile(dto.profile),
  };
}
