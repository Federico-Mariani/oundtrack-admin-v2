import { createActionGroup, props } from '@ngrx/store';
import type { LoginCredentials } from '../../../domain/models/login-credentials';

export const AuthLoginActions = createActionGroup({
  source: 'AUTH - Login',
  events: {
    'Login Submitted': props<{
      credentials: LoginCredentials;
    }>(),
  },
});
