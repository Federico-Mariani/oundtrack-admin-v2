import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { type AuthState, initialAuthState } from '../auth.state';

/** Logout wipes the whole auth slice: session, user and any stale request outcome. */
export const authLogoutReducers: ReducerTypes<AuthState, readonly ActionCreator[]>[] = [
  on(AuthLogoutActions.logoutSubmitted, (state): AuthState => ({
    ...initialAuthState,
    generation: state.generation,
  })),
];
