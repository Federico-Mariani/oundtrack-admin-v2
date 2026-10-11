import type { AuthSessionModel } from '../../domain/models/auth-session.model';

/**
 * Port for persisting the session across page reloads.
 * The store is the single source of truth at runtime; this is only durable storage.
 */
export interface AuthSessionStoragePort {
  load(): AuthSessionModel | null;

  save(session: AuthSessionModel): void;

  clear(): void;
}
