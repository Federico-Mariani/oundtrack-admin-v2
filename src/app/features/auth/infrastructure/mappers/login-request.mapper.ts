import type { LoginCredentials } from '../../domain/models/login-credentials';
import type { LoginRequestDto } from '../api/dto/login-request.dto';

export function toLoginRequestDto(credentials: LoginCredentials): LoginRequestDto {
  return { email: credentials.email, password: credentials.password };
}
