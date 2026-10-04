import {inject, Injectable} from '@angular/core';
import {ActivatedRoute, type NavigationExtras, Router, type UrlTree} from '@angular/router';
import {AUTH_NAVIGATION} from './auth.navigation';
import {RETURN_URL_QUERY_PARAM} from './auth.paths';
import {resolveAuthReturnUrl} from '@features/auth/presentation/routing/auth-return-url';

/**
 * Imperative navigation to Auth destinations. Encapsulates the Angular Router so
 * consumers (this feature's presentation, guards, or another feature's
 * presentation via the public API) never build Auth URLs by hand.
 *
 * It knows the Router only — never the Store, actions or the feature state.
 */
@Injectable({providedIn: 'root'})
export class AuthNavigationService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Navigate to the login page. The caller decides to `await` or `void` the result. */
  goToLogin(extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([...AUTH_NAVIGATION.login()], extras);
  }

  navigateAfterLogin(
    requestedUrl: string | null,
  ): Promise<boolean> {
    const returnUrl =
      resolveAuthReturnUrl(requestedUrl);

    return returnUrl
      ? this.router.navigateByUrl(returnUrl)
      : this.router.navigate(['/']);
  }

  /**
   * Build a redirect to the login page as a `UrlTree` (for guards), optionally
   * preserving the attempted URL in the `returnUrl` query parameter.
   */
  loginRedirect(returnUrl?: string): UrlTree {
    return this.router.createUrlTree(
      [...AUTH_NAVIGATION.login()],
      returnUrl ? {queryParams: {[RETURN_URL_QUERY_PARAM]: returnUrl}} : {},
    );
  }
}
