import { createActionGroup, props } from '@ngrx/store';
import type { AuthSessionModel } from '../../../domain/models/auth-session.model';
import type { RequestError } from '@shared/state/request/request-error';

export const AuthRefreshActions = createActionGroup({
  source: 'Auth Refresh',
  events: {
    Requested: props<{ generation: number }>(),
    Succeeded: props<{ generation: number; session: AuthSessionModel }>(),
    Failed: props<{ generation: number; error: RequestError }>(),
    Rejected: props<{ generation: number }>(),
  },
});
