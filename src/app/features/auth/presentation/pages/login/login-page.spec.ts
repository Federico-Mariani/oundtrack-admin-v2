import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthFacade } from '../../../application/state/facades/auth.facade';
import { AuthNavigationService } from '../../routing/auth-navigation.service';
import { LoginPage } from './login-page';

describe('Login redirect loading', () => {
  it.each([true, false])('keeps loading until navigation settles with %s', async (result) => {
    const authenticated = signal(false);
    let resolveNavigation!: (result: boolean) => void;
    const navigation = new Promise<boolean>((resolve) => {
      resolveNavigation = resolve;
    });
    const navigateAfterLogin = vi.fn(() => navigation);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: { data: { isAuthenticated: authenticated } } },
        { provide: AuthNavigationService, useValue: { navigateAfterLogin } },
      ],
    }).overrideComponent(LoginPage, {
      set: { imports: [], template: '<button [attr.aria-busy]="navigating()"></button>' },
    });
    const fixture = TestBed.createComponent(LoginPage);
    fixture.componentRef.setInput('returnUrl', '/movies');
    await fixture.whenStable();
    authenticated.set(true);
    fixture.detectChanges();
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(navigateAfterLogin).toHaveBeenCalledExactlyOnceWith('/movies');
    resolveNavigation(result);
    await navigation;
    await fixture.whenStable();
    expect(button.getAttribute('aria-busy')).toBe('false');
    expect(navigateAfterLogin).toHaveBeenCalledTimes(1);
  });
});
