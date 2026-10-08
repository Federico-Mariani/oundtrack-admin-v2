import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AuthFacade } from '../../../application/state/facades/auth.facade';
import { AuthNavigationService } from '../auth-navigation.service';

/** Allows navigation only to authenticated users; otherwise redirects to login. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthFacade);
  const navigation = inject(AuthNavigationService);

  return auth.data.isAuthenticated() ? true : navigation.loginRedirect(state.url);
};
