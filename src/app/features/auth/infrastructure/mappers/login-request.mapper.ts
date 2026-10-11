import type { LoginCredentialsModel } from '../../domain/models/login-credentials.model';
import type { LoginRequestDto } from '../api/dto/login-request.dto';

export function toLoginRequestDto(credentials: LoginCredentialsModel): LoginRequestDto {
  return { email: credentials.email, password: credentials.password };
}
