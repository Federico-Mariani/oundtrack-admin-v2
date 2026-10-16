import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { LoginCredentialsModel } from '../../../domain/models/login-credentials.model';
import type { AuthSessionModel } from '../../../domain/models/auth-session.model';

export const AuthLoginActions = createRequestActions<
  { readonly credentials: LoginCredentialsModel },
  { readonly session: AuthSessionModel },
  { readonly error: RequestError }
>('Auth', 'Login');
