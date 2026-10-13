import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTransloco, provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { of } from 'rxjs';
import { Sidebar } from './sidebar';

@Component({
  selector: 'app-sidebar-scope-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Sidebar, TranslocoDirective],
  template: `<app-sidebar [groups]="[]"
    ><p *transloco="let t; prefix: 'movies'">{{ t('title') }}</p></app-sidebar
  >`,
})
class SidebarScopeTest {}

class EmptyLoader {
  getTranslation() {
    return of({});
  }
}

describe('Sidebar translation isolation', () => {
  it('keeps shell labels and projected feature translations in separate scopes', async () => {
    TestBed.configureTestingModule({
      imports: [SidebarScopeTest],
      providers: [
        provideRouter([]),
        provideTransloco({
          config: { availableLangs: ['en', 'it'], defaultLang: 'en', prodMode: true },
          loader: EmptyLoader,
        }),
        provideTranslocoScope({
          scope: 'movies',
          loader: { en: () => Promise.resolve({ title: 'Movie catalog' }) },
        }),
      ],
    });
    const fixture = TestBed.createComponent(SidebarScopeTest);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    await vi.waitFor(() => {
      expect(element.textContent).toContain('Oundtrack');
      expect(element.querySelector('p')?.textContent).toBe('Movie catalog');
    });
  });
});
