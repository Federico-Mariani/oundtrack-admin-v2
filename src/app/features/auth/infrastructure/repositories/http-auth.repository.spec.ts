import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import type { AuthError } from '../../domain/errors/auth-error';
import { HttpAuthRepository } from './http-auth.repository';

describe('HttpAuthRepository', () => {
  let repository: HttpAuthRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpAuthRepository],
    });

    repository = TestBed.inject(HttpAuthRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('posts credentials as username/password and maps the session', async () => {
    const session$ = firstValueFrom(repository.login({ email: 'a@b.c', password: 'pw' }));

    const request = httpMock.expectOne(`${environment.apiUrl}/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'a@b.c', password: 'pw' });

    request.flush({
      data: {
        accessToken: 'access',
        expiresIn: 60,
        refreshToken: 'refresh',
        refreshExpiresIn: 120,
      },
      _meta: null,
    });

    const session = await session$;
    expect(session.accessToken).toBe('access');
    expect(session.refreshToken).toBe('refresh');
    expect(session.accessTokenExpiresAt).toBeGreaterThan(Date.now());
  });

  it('maps a 401 on login into an invalid-credentials AuthError', async () => {
    const session$ = firstValueFrom(repository.login({ email: 'a@b.c', password: 'wrong' }));

    httpMock
      .expectOne(`${environment.apiUrl}/login`)
      .flush({ message: 'Bad credentials' }, { status: 401, statusText: 'Unauthorized' });

    await expect(session$).rejects.toEqual<AuthError>({
      code: 'invalid-credentials',
      message: 'Bad credentials',
      fieldErrors: undefined,
    });
  });

  it('unwraps the envelope and maps the current user', async () => {
    const user$ = firstValueFrom(repository.getCurrentUser());

    const request = httpMock.expectOne(`${environment.apiUrl}/me`);
    expect(request.request.method).toBe('GET');
    request.flush({
      data: { id: '1', firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.c' },
      _meta: null,
    });

    await expect(user$).resolves.toEqual({
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'a@b.c',
    });
  });
});
