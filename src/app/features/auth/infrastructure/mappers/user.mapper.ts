import type { User } from '../../domain/models/user';
import type { UserResponseDto } from '../api/dto/user-response.dto';

export function toUser(dto: UserResponseDto): User {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
  };
}
