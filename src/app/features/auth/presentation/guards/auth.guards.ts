import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../../application/state/facades/auth.facade';
import { AUTH_PATHS, RETURN_URL_QUERY_PARAM } from '../auth.paths';

/** Allows navigation only to authenticated users; otherwise redirects to login. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  if (auth.data.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([`/${AUTH_PATHS.login}`], {
    queryParams: { [RETURN_URL_QUERY_PARAM]: state.url },
  });
};

/** Keeps authenticated users away from guest-only pages such as login. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  return auth.data.isAuthenticated() ? router.createUrlTree(['/']) : true;
};
