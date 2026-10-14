import type { Observable } from 'rxjs';
import type { AuthSessionModel } from '../../domain/models/auth-session.model';
import type { RequestState } from '@shared/state/request/request-state';
import type { RequestError } from '@shared/state/request/request-error';

export interface AuthRefreshSnapshot {
  readonly session: AuthSessionModel | null;
  readonly generation: number;
  readonly request: RequestState<RequestError>;
}

export interface AuthRefreshPort {
  snapshot(): AuthRefreshSnapshot;
  readonly changes$: Observable<AuthRefreshSnapshot>;
  refresh(generation: number): void;
  expire(generation: number): void;
}
