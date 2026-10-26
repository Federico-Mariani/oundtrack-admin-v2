import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideFilm, lucideHome, lucideTags, lucideTv, lucideUserRound } from '@ng-icons/lucide';
import { HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { of } from 'rxjs';
import { SidebarNavigation } from './sidebar-navigation';
import { DEFAULT_SIDEBAR_GROUPS } from '../../../layouts/default-layout/default-sidebar.config';
import en from '@app/presentation/i18n/en/sidebar.json';
import italian from '@app/presentation/i18n/it/sidebar.json';

@Component({
  selector: 'app-sidebar-test-page',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SidebarTestPage {}

class SidebarTranslationLoader {
  getTranslation(lang: string) {
    return of({ sidebar: { menu: lang === 'it' ? italian : en } });
  }
}

describe('Configured sidebar navigation', () => {
  async function setup() {
    TestBed.configureTestingModule({
      imports: [SidebarNavigation],
      providers: [
        provideRouter([
          { path: '', pathMatch: 'full', component: SidebarTestPage },
          { path: 'movies', component: SidebarTestPage },
          { path: 'tv-series', component: SidebarTestPage },
          { path: 'avatars', component: SidebarTestPage },
          { path: 'game-categories', component: SidebarTestPage },
          { path: 'reports', component: SidebarTestPage },
        ]),
        provideIcons({ lucideFilm, lucideHome, lucideTags, lucideTv, lucideUserRound }),
        provideTransloco({
          config: {
            availableLangs: ['en', 'it'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
            prodMode: true,
          },
          loader: SidebarTranslationLoader,
        }),
      ],
    });
    const fixture = TestBed.createComponent(SidebarNavigation);
    fixture.componentRef.setInput('groups', DEFAULT_SIDEBAR_GROUPS);
    await fixture.whenStable();
    return {
      fixture,
      element: fixture.nativeElement as HTMLElement,
      router: TestBed.inject(Router),
    };
  }

  it('renders direct icon links without submenu toggles and keeps the active item with URL filters', async () => {
    const { fixture, element, router } = await setup();
    expect(element.querySelector('button[data-sidebar="menu-button"]')).toBeNull();
    expect(element.querySelector('a[href="/movies/create"]')).toBeNull();
    for (const path of ['/movies', '/tv-series', '/game-categories', '/avatars']) {
      const link = element.querySelector<HTMLAnchorElement>(`a[href="${path}"]`)!;
      expect(link.querySelector('ng-icon')).not.toBeNull();
      link.click();
      await fixture.whenStable();
      expect(router.url).toBe(path);
      expect(link.getAttribute('aria-current')).toBe('page');
    }
    await router.navigateByUrl('/movies?search=Dune&detail=movie-1');
    await fixture.whenStable();
    expect(element.querySelector('a[href="/movies"]')?.getAttribute('data-active')).toBe('true');
    expect(element.querySelectorAll('a[aria-current="page"]')).toHaveLength(1);
  });

  it('closes the mobile panel on normal navigation but preserves modifier clicks', async () => {
    const { fixture, element } = await setup();
    const close = vi.spyOn(TestBed.inject(HlmSidebarService), 'setOpenMobile');
    const link = element.querySelector<HTMLAnchorElement>('a[href="/movies"]')!;
    link.dispatchEvent(new MouseEvent('click', { ctrlKey: true, bubbles: true }));
    expect(close).not.toHaveBeenCalled();
    link.click();
    await fixture.whenStable();
    expect(close).toHaveBeenCalledWith(false);
  });

  it('renders additional configuration without template changes and reacts to language changes', async () => {
    const { fixture, element } = await setup();
    fixture.componentRef.setInput('groups', [
      {
        id: 'custom',
        items: [{ id: 'reports', labelKey: 'sidebar.menu.home', commands: ['/reports'] }],
      },
    ]);
    await fixture.whenStable();
    expect(element.querySelectorAll('a')).toHaveLength(1);
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/reports');
    TestBed.inject(TranslocoService).setActiveLang('it');
    await fixture.whenStable();
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('Navigazione principale');
  });
});
