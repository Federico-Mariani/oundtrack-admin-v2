import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../../../application/state/facades/auth.facade';

/** Keeps authenticated users away from guest-only pages such as login. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  // Authenticated users are sent to the application root (the post-login landing).
  return auth.data.isAuthenticated() ? router.createUrlTree(['/']) : true;
};
