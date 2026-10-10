import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import type { ApiResponse } from '@app/core/http/api-response';
import type { AuthSession } from '../../domain/models/auth-session';
import type { LoginCredentials } from '../../domain/models/login-credentials';
import type { User } from '../../domain/models/user';
import type { AuthRepository } from '../../application/ports/auth.repository';
import type { TokensResponseDto } from '../api/dto/tokens-response.dto';
import type { UserResponseDto } from '../api/dto/user-response.dto';
import { toAuthSession } from '../mappers/auth-session.mapper';
import { toLoginRequestDto } from '../mappers/login-request.mapper';
import { toUser } from '../mappers/user.mapper';
import {toRequestError} from "../../../../core/http/http-error.mapper";

@Injectable()
export class HttpAuthRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/auth';

  login(credentials: LoginCredentials): Observable<AuthSession> {
    return this.http
      .post<ApiResponse<TokensResponseDto>>(
        `${this.baseUrl}/sign-in`,
        toLoginRequestDto(credentials),
      )
      .pipe(
        map(({ data }) => toAuthSession(data)),
        catchError((response: HttpErrorResponse) =>
          throwError(() => toRequestError(response)),
        ),
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<UserResponseDto>>(`${this.baseUrl}/me`).pipe(
      map(({ data }) => toUser(data)),
      catchError((error: HttpErrorResponse) =>
        throwError(() => toRequestError(error)),
      ),
    );
  }
}
