import {inject} from '@angular/core';
import {type CanActivateFn, Router} from '@angular/router';
import {AuthFacade, AuthNavigationService} from '@features/auth';

/** Allows navigation only to authenticated users; otherwise redirects to login. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthFacade);
  const navigation = inject(AuthNavigationService);

  return auth.data.isAuthenticated() ? true : navigation.loginRedirect(state.url);
};

/** Keeps authenticated users away from guest-only pages such as login. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  // Authenticated users are sent to the application root (the post-login landing).
  return auth.data.isAuthenticated() ? router.createUrlTree(['/']) : true;
};
