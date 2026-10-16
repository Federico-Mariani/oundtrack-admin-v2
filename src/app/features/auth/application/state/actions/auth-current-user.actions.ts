import { createEmptyRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { UserModel } from '../../../domain/models/user.model';

export const AuthCurrentUserActions = createEmptyRequestActions<
  { readonly user: UserModel },
  { readonly error: RequestError }
>('Auth', 'Get Current User');
