import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import type { AuthSessionStorage } from '../../application/ports/auth-session-storage';
import type { AuthSession } from '../../domain/models/auth-session';

@Injectable()
export class LocalStorageAuthSessionStorage implements AuthSessionStorage {
  private readonly storageKey = environment.authStorageKey;

  load(): AuthSession | null {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      return isAuthSession(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  save(session: AuthSession): void {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<keyof AuthSession, unknown>;

  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.accessTokenExpiresAt === 'number' &&
    typeof candidate.refreshToken === 'string' &&
    typeof candidate.refreshTokenExpiresAt === 'number'
  );
}
