import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  type ActivatedRouteSnapshot,
  provideRouter,
  Router,
  type RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthFacade } from '../../application/state/facades/auth.facade';
import { authGuard, guestGuard } from './auth.guards';

describe('auth guards', () => {
  const isAuthenticated = signal(false);
  const routeSnapshot = {} as ActivatedRouteSnapshot;
  const stateSnapshot = { url: '/orders/42' } as RouterStateSnapshot;

  let router: Router;

  beforeEach(() => {
    isAuthenticated.set(false);

    // Presentation knows only the facade: a fake is enough, no NgRx involved.
    const authFacade: { data: Pick<AuthFacade['data'], 'isAuthenticated'> } = {
      data: { isAuthenticated },
    };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthFacade, useValue: authFacade }],
    });

    router = TestBed.inject(Router);
  });

  const runGuard = (guard: typeof authGuard) =>
    TestBed.runInInjectionContext(() => guard(routeSnapshot, stateSnapshot));

  describe('authGuard', () => {
    it('allows authenticated users', () => {
      isAuthenticated.set(true);
      expect(runGuard(authGuard)).toBe(true);
    });

    it('redirects anonymous users to login keeping the requested url', () => {
      const result = runGuard(authGuard) as UrlTree;

      expect(result).toBeInstanceOf(UrlTree);
      expect(router.serializeUrl(result)).toBe('/login?returnUrl=%2Forders%2F42');
    });
  });

  describe('guestGuard', () => {
    it('allows anonymous users', () => {
      expect(runGuard(guestGuard)).toBe(true);
    });

    it('redirects authenticated users to the home page', () => {
      isAuthenticated.set(true);
      const result = runGuard(guestGuard) as UrlTree;

      expect(router.serializeUrl(result)).toBe('/');
    });
  });
});
