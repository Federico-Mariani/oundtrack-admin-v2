import { createReducer } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import { authLoginReducers } from './reducers/auth-login.reducer';
import { authLogoutReducers } from './reducers/auth-logout.reducer';
import { authRegistrationReducers } from './reducers/auth-registration.reducer';
import { authSessionReducers } from './reducers/auth-session.reducer';
import { authUserReducers } from './reducers/auth-user.reducer';

/**
 * Root reducer of the single Auth feature state, composed from one
 * micro-reducer per capability. Each capability only touches its own slice.
 */
export const authReducer = createReducer(
  initialAuthState,
  ...authSessionReducers,
  ...authLoginReducers,
  ...authRegistrationReducers,
  ...authUserReducers,
  ...authLogoutReducers,
);
