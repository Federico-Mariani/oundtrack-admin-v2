import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import type { AuthSessionStoragePort } from '../../application/ports/auth-session-storage.port';
import type { AuthSessionModel } from '../../domain/models/auth-session.model';

@Injectable()
export class LocalStorageAuthSessionStorage implements AuthSessionStoragePort {
  private readonly storageKey = environment.authStorageKey;

  load(): AuthSessionModel | null {
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

  save(session: AuthSessionModel): void {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}

function isAuthSession(value: unknown): value is AuthSessionModel {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<keyof AuthSessionModel, unknown>;

  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.accessTokenExpiresAt === 'number' &&
    typeof candidate.refreshToken === 'string' &&
    typeof candidate.refreshTokenExpiresAt === 'number'
  );
}
