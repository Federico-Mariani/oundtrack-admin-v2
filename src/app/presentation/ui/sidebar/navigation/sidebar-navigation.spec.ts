import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideFilm, lucideHome } from '@ng-icons/lucide';
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
          { path: 'movies/create', component: SidebarTestPage },
          { path: 'reports', component: SidebarTestPage },
        ]),
        provideIcons({ lucideFilm, lucideHome }),
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

  it('navigates to Movies and Create with real anchors and correct active children', async () => {
    const { fixture, element, router } = await setup();
    const movies = element.querySelector<HTMLAnchorElement>('a[href="/movies"]')!;
    movies.click();
    await fixture.whenStable();
    expect(router.url).toBe('/movies');
    const create = element.querySelector<HTMLAnchorElement>('a[href="/movies/create"]')!;
    create.click();
    await fixture.whenStable();
    expect(router.url).toBe('/movies/create');
    expect(create.getAttribute('aria-current')).toBe('page');
    expect(
      element
        .querySelector('a[data-sidebar="menu-sub-button"][href="/movies"]')
        ?.hasAttribute('aria-current'),
    ).toBe(false);
    element.querySelector<HTMLAnchorElement>('a[href="/"]')!.click();
    await fixture.whenStable();
    expect(router.url).toBe('/');
  });

  it('opens the active section on direct navigation and closes the mobile panel on selection', async () => {
    const { fixture, element, router } = await setup();
    await router.navigateByUrl('/movies/create');
    await fixture.whenStable();
    expect(element.querySelector('button[aria-expanded="true"]')).not.toBeNull();
    const close = vi.spyOn(TestBed.inject(HlmSidebarService), 'setOpenMobile');
    element.querySelector<HTMLAnchorElement>('a[href="/movies"]')!.click();
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
