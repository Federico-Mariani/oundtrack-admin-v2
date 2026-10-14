import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthFacade, AuthNavigationService } from '@features/auth';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { ThemeService } from '@app/core/theme/theme.service';
import { DefaultLayout } from './default-layout';

describe('Logout redirect loading', () => {
  it.each([true, false])(
    'keeps loading and ignores duplicate logout until navigation settles with %s',
    async (result) => {
      let resolveNavigation!: (result: boolean) => void;
      const navigation = new Promise<boolean>((resolve) => {
        resolveNavigation = resolve;
      });
      const logout = vi.fn();
      const goToLogin = vi.fn(() => navigation);
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AuthFacade,
            useValue: {
              data: { user: signal(null), isAuthenticated: signal(true) },
              actions: { logout },
            },
          },
          { provide: AuthNavigationService, useValue: { goToLogin } },
          { provide: LanguageService, useValue: { options: [], activeLanguage: signal('en') } },
          { provide: ThemeService, useValue: { isDark: signal(false) } },
        ],
      }).overrideComponent(DefaultLayout, {
        set: {
          imports: [],
          template: '<button (click)="logout()" [attr.aria-busy]="loggingOut()"></button>',
        },
      });
      const fixture = TestBed.createComponent(DefaultLayout);
      await fixture.whenStable();
      const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
      button.click();
      fixture.detectChanges();
      expect(button.getAttribute('aria-busy')).toBe('true');
      button.click();
      expect(logout).toHaveBeenCalledTimes(1);
      expect(goToLogin).toHaveBeenCalledTimes(1);
      resolveNavigation(result);
      await navigation;
      await fixture.whenStable();
      expect(button.getAttribute('aria-busy')).toBe('false');
    },
  );
});
