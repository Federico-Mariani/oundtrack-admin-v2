import { createActionGroup, props } from '@ngrx/store';
import type { LoginCredentialsModel } from '../../../domain/models/login-credentials.model';

export const AuthLoginActions = createActionGroup({
  source: 'AUTH - Login',
  events: {
    'Login Submitted': props<{
      credentials: LoginCredentialsModel;
    }>(),
  },
});
