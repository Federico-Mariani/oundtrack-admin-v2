import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { AuthNavigationService } from './auth-navigation.service';

describe('AuthNavigationService', () => {
  let service: AuthNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(AuthNavigationService);
    router = TestBed.inject(Router);
  });

  it('navigates to the login page with the login navigation command', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const result = await service.goToLogin();

    expect(result).toBe(true);
    expect(navigate).toHaveBeenCalledWith(['/', 'login'], undefined);
  });

  it('forwards navigation extras to the router', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await service.goToLogin({ replaceUrl: true });

    expect(navigate).toHaveBeenCalledWith(['/', 'login'], { replaceUrl: true });
  });

  it('builds a plain login redirect UrlTree', () => {
    const tree = service.loginRedirect();

    expect(tree).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(tree)).toBe('/login');
  });

  it('preserves the attempted url as the returnUrl query parameter', () => {
    const tree = service.loginRedirect('/orders/42');

    expect(router.serializeUrl(tree)).toBe('/login?returnUrl=%2Forders%2F42');
  });
});
