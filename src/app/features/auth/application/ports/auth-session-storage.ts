import type { AuthSession } from '../../domain/models/auth-session';

/**
 * Port for persisting the session across page reloads.
 * The store is the single source of truth at runtime; this is only durable storage.
 */
export interface AuthSessionStorage {
  load(): AuthSession | null;

  save(session: AuthSession): void;

  clear(): void;
}
