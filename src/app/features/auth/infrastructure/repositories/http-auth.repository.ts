import {HttpClient, type HttpErrorResponse} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, map, type Observable, throwError} from 'rxjs';
import {environment} from '@environments/environment';
import type {ApiResponse} from '@app/core/http/api-response';
import type {AuthSession} from '../../domain/models/auth-session';
import type {LoginCredentials, RegistrationData, User} from '@features/auth';
import type {AuthRepository} from '../../application/ports/auth.repository';
import type {RegistrationRequestDto} from '../api/dto/registration-request.dto';
import type {TokensResponseDto} from '../api/dto/tokens-response.dto';
import type {UserResponseDto} from '../api/dto/user-response.dto';
import {toAuthError} from '../mappers/auth-error.mapper';
import {toAuthSession} from '../mappers/auth-session.mapper';
import {toLoginRequestDto} from '../mappers/login-request.mapper';
import {toUser} from '../mappers/user.mapper';

@Injectable()
export class HttpAuthRepository implements AuthRepository {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiUrl + '/auth';

    login(credentials: LoginCredentials): Observable<AuthSession> {
        return this.http
            .post<ApiResponse<TokensResponseDto>>(`${this.baseUrl}/sign-in`, toLoginRequestDto(credentials))
            .pipe(
                map(({data}) => toAuthSession(data)),
                catchError((response: HttpErrorResponse) =>
                    throwError(() => toAuthError(response, 'login')),
                ),
            );
    }

    register(data: RegistrationData): Observable<AuthSession> {
        const body: RegistrationRequestDto = data;

        return this.http.post<ApiResponse<TokensResponseDto>>(`${this.baseUrl}/sign-up`, body).pipe(
            map((response) => toAuthSession(response.data)),
            catchError((response: HttpErrorResponse) =>
                throwError(() => toAuthError(response, 'register')),
            ),
        );
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<ApiResponse<UserResponseDto>>(`${this.baseUrl}/me`).pipe(
            map(({data}) => toUser(data)),
            catchError((response: HttpErrorResponse) =>
                throwError(() => toAuthError(response, 'current-user')),
            ),
        );
    }
}
