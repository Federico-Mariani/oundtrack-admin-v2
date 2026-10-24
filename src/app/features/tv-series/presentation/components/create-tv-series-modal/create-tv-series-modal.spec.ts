import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTransloco } from '@jsverse/transloco';
import { of } from 'rxjs';
import { CreateTvSeriesModal } from './create-tv-series-modal';
import { TvSeriesFacade } from '../../../application/state/facades/tv-series.facade';
import { CatalogCreationDialog } from '@app/core/catalog/presentation/catalog-creation-dialog';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { LANGUAGE_OPTIONS } from '@app/core/i18n/language/language-options';
import validation from '@app/core/i18n/translations/en/validation.json';
import type { RequestError } from '@shared/state/request/request-error';
class Loader {
  getTranslation() {
    return of({ validation });
  }
}
@Component({
  selector: 'app-creation-test-host',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Host {
  readonly container = inject(ViewContainerRef);
  readonly dialog = new CatalogCreationDialog();
}
describe('TvSeries creation dialog', () => {
  it('keeps errors and pending work in the dialog, refreshes only on success and starts clean when reopened', async () => {
    const busy = signal(false),
      success = signal(false),
      error = signal<RequestError | null>(null);
    const save = vi.fn(() => {
        busy.set(true);
      }),
      refresh = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideTransloco({
          config: { availableLangs: ['en'], defaultLang: 'en', prodMode: true },
          loader: Loader,
        }),
        {
          provide: LanguageService,
          useValue: { options: LANGUAGE_OPTIONS, activeLocale: signal('it-IT') },
        },
        {
          provide: TvSeriesFacade,
          useValue: {
            requests: { create: { isLoading: busy, isSuccess: success, error } },
            actions: {
              createTvSeries: save,
              resetCreateTvSeries: () => {
                success.set(false);
                error.set(null);
              },
            },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(Host);
    const open = () => {
      fixture.componentInstance.dialog.open(CreateTvSeriesModal, refresh);
    };
    open();
    open();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(document.querySelector('app-create-tv-series-modal form')).not.toBeNull();
    });
    expect(document.querySelectorAll('app-create-tv-series-modal')).toHaveLength(1);
    const root = document.querySelector<HTMLElement>('app-create-tv-series-modal')!;
    for (const [selector, value] of [
      ['input[type="text"]', 'Dune'],
      ['input[type="number"]', '2021'],
    ]) {
      const input = root.querySelector<HTMLInputElement>(selector)!;
      input.value = value!;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    fixture.detectChanges();
    root
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(save).toHaveBeenCalledWith({ title: 'Dune', year: 2021, language: 'it-IT' });
    expect(root.querySelector<HTMLButtonElement>('app-icon-button button')?.disabled).toBe(true);
    expect(refresh).not.toHaveBeenCalled();
    busy.set(false);
    error.set({ code: 'network' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('server');
    expect(root.querySelector<HTMLInputElement>('input[type="text"]')?.value).toBe('Dune');
    error.set(null);
    success.set(true);
    fixture.detectChanges();
    await vi.waitFor(() => {
      expect(refresh).toHaveBeenCalledTimes(1);
    });
    open();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(document.querySelector('app-create-tv-series-modal form')).not.toBeNull();
    });
    const reopened = document.querySelector('app-create-tv-series-modal')!;
    expect(reopened.querySelector<HTMLInputElement>('input[type="text"]')?.value).toBe('');
    reopened.querySelector<HTMLButtonElement>('app-icon-button button')!.click();
    await fixture.whenStable();
    expect(refresh).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });
});
