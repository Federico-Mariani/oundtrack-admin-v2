import type { AuthSessionStorage } from '../application/ports/auth-session-storage';
import type { AuthSession } from '../domain/models/auth-session';

/** Test double for `AuthSessionStorage`; `session` can be preset or inspected directly. */
export class InMemoryAuthSessionStorage implements AuthSessionStorage {
  session: AuthSession | null = null;

  load(): AuthSession | null {
    return this.session;
  }

  save(session: AuthSession): void {
    this.session = session;
  }

  clear(): void {
    this.session = null;
  }
}
