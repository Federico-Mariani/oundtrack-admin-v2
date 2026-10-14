import {
  HttpClient,
  type HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { environment } from '@environments/environment';
import { authFeature } from '../application/state/auth.feature';
import * as refreshEffects from '../application/state/effects/auth-refresh.effects';
import * as sessionEffects from '../application/state/effects/auth-session.effects';
import { AuthRefreshFacade } from '../application/state/facades/auth-refresh.facade';
import { AUTH_REFRESH } from '../application/tokens/auth-refresh.token';
import { AUTH_REPOSITORY } from '../application/tokens/auth-repository.token';
import { AUTH_SESSION_STORAGE } from '../application/tokens/auth-session-storage.token';
import { AuthSessionStorageActions } from '../application/state/actions/auth-session-storage.actions';
import { AuthLogoutActions } from '../application/state/actions/auth-logout.actions';
import { AuthSessionActions } from '../application/state/actions/auth-session.actions';
import { AuthRefreshActions } from '../application/state/actions/auth-refresh.actions';
import { HttpAuthRepository } from '../infrastructure/repositories/http-auth.repository';
import { AuthTokenRefresh } from '../infrastructure/http/auth-token-refresh';
import { authTokenInterceptor } from '../infrastructure/http/auth-token.interceptor';
import { toAuthSession } from '../infrastructure/mappers/auth-session.mapper';
import type { AuthSessionModel } from '../domain/models/auth-session.model';

function tokens(id: string) {
  const jwt = (kind: string, expires: number) =>
    `header.${btoa(JSON.stringify({ exp: expires, jti: `${id}-${kind}` }))}.signature`;
  const now = Math.floor(Date.now() / 1000);
  return { accessToken: jwt('access', now + 600), refreshToken: jwt('refresh', now + 3600) };
}

describe('Automatic token refresh', () => {
  const api = environment.apiUrl;
  const refreshUrl = `${api}/auth/refresh`;
  const unauthorized = { statusCode: 401, message: 'Accesso non autorizzato' };
  let http: HttpClient;
  let requests: HttpTestingController;
  let store: Store;
  let original: AuthSessionModel;
  let stored: AuthSessionModel | null;
  const errors: HttpErrorResponse[] = [];

  beforeEach(() => {
    errors.length = 0;
    stored = null;
    TestBed.configureTestingModule({
      providers: [
        provideStore({ [authFeature.name]: authFeature.reducer }),
        provideEffects(refreshEffects, sessionEffects),
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        AuthTokenRefresh,
        { provide: AUTH_REFRESH, useExisting: AuthRefreshFacade },
        { provide: AUTH_REPOSITORY, useClass: HttpAuthRepository },
        {
          provide: AUTH_SESSION_STORAGE,
          useValue: {
            load: () => stored,
            save: (session: AuthSessionModel) => {
              stored = session;
            },
            clear: () => {
              stored = null;
            },
          },
        },
      ],
    });
    http = TestBed.inject(HttpClient);
    requests = TestBed.inject(HttpTestingController);
    store = TestBed.inject<Store>(Store);
    original = toAuthSession(tokens('original'));
    store.dispatch(AuthSessionStorageActions.sessionRestored({ session: original }));
  });

  afterEach(() => {
    requests.verify();
  });

  function get(path: string) {
    http
      .get(`${api}/${path}`)
      .subscribe({ error: (error: HttpErrorResponse) => errors.push(error) });
  }

  function reject(path: string) {
    requests
      .expectOne(`${api}/${path}`)
      .flush(unauthorized, { status: 401, statusText: 'Unauthorized' });
  }

  it('shares one refresh, rotates both tokens, persists them and replays concurrent requests', () => {
    get('movies');
    get('reports');
    reject('movies');
    reject('reports');
    const refresh = requests.expectOne(refreshUrl);
    expect(refresh.request.method).toBe('POST');
    expect(refresh.request.body).toEqual({ refreshToken: original.refreshToken });
    expect(refresh.request.headers.has('Authorization')).toBe(false);
    const updated = tokens('updated');
    refresh.flush({ data: updated });
    for (const path of ['movies', 'reports']) {
      const retry = requests.expectOne(`${api}/${path}`);
      expect(retry.request.headers.get('Authorization')).toBe(`Bearer ${updated.accessToken}`);
      retry.flush({ data: [] });
    }
    expect(stored?.refreshToken).toBe(updated.refreshToken);
    expect(store.selectSignal(authFeature.selectAccessToken)()).toBe(updated.accessToken);
    expect(errors).toEqual([]);
  });

  it('uses the rotated refresh token on the next refresh', () => {
    get('movies');
    reject('movies');
    const updated = tokens('updated');
    requests.expectOne(refreshUrl).flush({ data: updated });
    requests.expectOne(`${api}/movies`).flush({});
    get('reports');
    reject('reports');
    const refresh = requests.expectOne(refreshUrl);
    expect(refresh.request.body).toEqual({ refreshToken: updated.refreshToken });
    refresh.flush({ data: tokens('next') });
    requests.expectOne(`${api}/reports`).flush({});
  });

  it('reuses the new access token when an old 401 arrives after refresh', () => {
    get('movies');
    get('reports');
    reject('movies');
    const updated = tokens('updated');
    requests.expectOne(refreshUrl).flush({ data: updated });
    requests.expectOne(`${api}/movies`).flush({});
    reject('reports');
    requests.expectNone(refreshUrl);
    const retry = requests.expectOne(`${api}/reports`);
    expect(retry.request.headers.get('Authorization')).toBe(`Bearer ${updated.accessToken}`);
    retry.flush({});
  });

  it('expires the session when refresh is rejected, without looping', () => {
    stored = original;
    get('movies');
    reject('movies');
    requests.expectOne(refreshUrl).flush(unauthorized, { status: 401, statusText: 'Unauthorized' });
    requests.expectNone(refreshUrl);
    requests.expectNone(`${api}/movies`);
    expect(store.selectSignal(authFeature.selectSession)()).toBeNull();
    expect(stored).toBeNull();
    expect(errors).toHaveLength(1);
  });

  it.each([0, 500])('preserves the session after a temporary refresh failure (%s)', (status) => {
    get('movies');
    reject('movies');
    const refresh = requests.expectOne(refreshUrl);
    if (status === 0) {
      refresh.error(new ProgressEvent('error'));
    } else {
      refresh.flush({}, { status, statusText: 'Server Error' });
    }
    expect(store.selectSignal(authFeature.selectSession)()).toEqual(original);
    expect(errors[0]?.status).toBe(status);
    get('retry');
    reject('retry');
    requests.expectOne(refreshUrl).flush({ data: tokens('recovered') });
    requests.expectOne(`${api}/retry`).flush({});
  });

  it('retries a protected request only once and expires on a second 401', () => {
    get('movies');
    reject('movies');
    requests.expectOne(refreshUrl).flush({ data: tokens('updated') });
    reject('movies');
    requests.expectNone(refreshUrl);
    expect(errors).toHaveLength(1);
    expect(store.selectSignal(authFeature.selectSession)()).toBeNull();
  });

  it('cancels refresh on logout and rejects stale completion actions', () => {
    get('movies');
    reject('movies');
    const refresh = requests.expectOne(refreshUrl);
    const generation = store.selectSignal(authFeature.selectGeneration)();
    store.dispatch(AuthLogoutActions.logoutSubmitted());
    expect(refresh.cancelled).toBe(true);
    const session = toAuthSession(tokens('stale'));
    store.dispatch(AuthRefreshActions.succeeded({ generation, session }));
    expect(store.selectSignal(authFeature.selectSession)()).toBeNull();
    expect(stored).toBeNull();
    expect(errors).toHaveLength(1);
  });

  it('does not replay a previous account request under a new session', () => {
    get('movies');
    store.dispatch(AuthLogoutActions.logoutSubmitted());
    const session = toAuthSession(tokens('new-account'));
    store.dispatch(AuthSessionStorageActions.sessionRestored({ session }));
    reject('movies');
    requests.expectNone(refreshUrl);
    requests.expectNone(`${api}/movies`);
    expect(store.selectSignal(authFeature.selectSession)()).toEqual(session);
    expect(errors).toHaveLength(1);
  });

  it.each(['auth/sign-in', 'auth/sign-up', 'auth/refresh'])(
    'excludes %s from bearer and refresh handling',
    (path) => {
      get(path);
      const request = requests.expectOne(`${api}/${path}`);
      expect(request.request.headers.has('Authorization')).toBe(false);
      request.flush(unauthorized, { status: 401, statusText: 'Unauthorized' });
      requests.expectNone(refreshUrl);
      expect(store.selectSignal(authFeature.selectSession)()).toEqual(original);
    },
  );

  it('does not send tokens to lookalike API prefixes', () => {
    http.get(`${api}-external/movies`).subscribe();
    const request = requests.expectOne(`${api}-external/movies`);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('does not refresh non-401 errors', () => {
    get('movies');
    requests.expectOne(`${api}/movies`).flush({}, { status: 403, statusText: 'Forbidden' });
    requests.expectNone(refreshUrl);
    expect(store.selectSignal(authFeature.selectSession)()).toEqual(original);
  });

  it('restores a refreshable session even when its access token has expired', () => {
    stored = { ...original, accessTokenExpiresAt: Date.now() - 1 };
    store.dispatch(AuthSessionActions.sessionRestoreRequested());
    expect(store.selectSignal(authFeature.selectSession)()).toEqual(stored);
  });

  it('expires an unusable refresh token without making a refresh request', () => {
    const session = { ...original, refreshTokenExpiresAt: Date.now() - 1 };
    store.dispatch(AuthSessionStorageActions.sessionRestored({ session }));
    get('movies');
    reject('movies');
    requests.expectNone(refreshUrl);
    expect(store.selectSignal(authFeature.selectSession)()).toBeNull();
  });
  it('preserves a POST body, query parameters and custom headers on retry', () => {
    const url = `${api}/movies?locale=it`;
    const body = { title: 'Example' };
    http.post(url, body, { headers: { 'X-Request-Id': 'test-request' } }).subscribe();
    requests.expectOne(url).flush(unauthorized, { status: 401, statusText: 'Unauthorized' });
    requests.expectOne(refreshUrl).flush({ data: tokens('updated') });
    const retry = requests.expectOne(url);
    expect(retry.request.method).toBe('POST');
    expect(retry.request.body).toEqual(body);
    expect(retry.request.headers.get('X-Request-Id')).toBe('test-request');
    retry.flush({});
  });

  it('does not refresh an anonymous request', () => {
    store.dispatch(AuthLogoutActions.logoutSubmitted());
    get('movies');
    reject('movies');
    requests.expectNone(refreshUrl);
    expect(errors).toHaveLength(1);
  });

  it('does not replace the current session with malformed refresh tokens', () => {
    get('movies');
    reject('movies');
    requests.expectOne(refreshUrl).flush({ data: { accessToken: '', refreshToken: '' } });
    expect(store.selectSignal(authFeature.selectSession)()).toEqual(original);
    requests.expectNone(`${api}/movies`);
    expect(errors).toHaveLength(1);
  });
});
