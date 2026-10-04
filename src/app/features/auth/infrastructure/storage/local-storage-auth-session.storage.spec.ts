import { environment } from '@environments/environment';
import type { AuthSession } from '../../domain/models/auth-session';
import { LocalStorageAuthSessionStorage } from './local-storage-auth-session.storage';

describe('LocalStorageAuthSessionStorage', () => {
  const session: AuthSession = {
    accessToken: 'access',
    accessTokenExpiresAt: 1,
    refreshToken: 'refresh',
    refreshTokenExpiresAt: 2,
  };

  let storage: LocalStorageAuthSessionStorage;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageAuthSessionStorage();
  });

  it('returns null when nothing is stored', () => {
    expect(storage.load()).toBeNull();
  });

  it('round-trips a session', () => {
    storage.save(session);
    expect(storage.load()).toEqual(session);
  });

  it('clears the stored session', () => {
    storage.save(session);
    storage.clear();
    expect(storage.load()).toBeNull();
  });

  it('ignores malformed or legacy payloads', () => {
    localStorage.setItem(environment.authStorageKey, 'not-json');
    expect(storage.load()).toBeNull();

    localStorage.setItem(
      environment.authStorageKey,
      JSON.stringify({ userTokens: { accessToken: 'legacy' } }),
    );
    expect(storage.load()).toBeNull();
  });
});
