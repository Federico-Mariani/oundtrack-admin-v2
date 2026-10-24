import { signal } from '@angular/core';
import { CatalogCreationForm } from './catalog-creation-form';
import { TestBed } from '@angular/core/testing';
import { provideTransloco } from '@jsverse/transloco';
import { of } from 'rxjs';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { LANGUAGE_OPTIONS } from '@app/core/i18n/language/language-options';
import validation from '@app/core/i18n/translations/en/validation.json';
import type { RequestError } from '@shared/state/request/request-error';

class TranslationLoader {
  getTranslation() {
    return of({
      validation,
      create: {
        fields: { title: 'Title', year: 'Year', language: 'Language' },
        submit: 'Create',
        cancel: 'Cancel',
      },
    });
  }
}

async function setup() {
  const createMovie = vi.fn();
  TestBed.configureTestingModule({
    imports: [CatalogCreationForm],
    providers: [
      provideTransloco({
        config: { availableLangs: ['en', 'it'], defaultLang: 'en', prodMode: true },
        loader: TranslationLoader,
      }),
      {
        provide: LanguageService,
        useValue: { options: LANGUAGE_OPTIONS, activeLocale: signal('it-IT') },
      },
    ],
  });
  const fixture = TestBed.createComponent(CatalogCreationForm);
  fixture.componentRef.setInput('translationPrefix', 'create');
  fixture.componentInstance.submitted.subscribe(createMovie);
  const busy = {
    set: (value: boolean) => {
      fixture.componentRef.setInput('busy', value);
    },
  };
  const error = {
    set: (value: RequestError | null) => {
      fixture.componentRef.setInput('error', value);
    },
  };
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  await vi.waitFor(() => {
    expect(element.querySelector('input[type="number"]')).not.toBeNull();
  });
  await fixture.whenStable();
  const fill = async (selector: string, value: string) => {
    const input = element.querySelector<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  };
  const submit = async () => {
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
  };
  return { fixture, element, fill, submit, busy, error, createMovie };
}

describe('Catalog creation form', () => {
  it('requires a nonblank title and integer year and submits numeric year with the selected language', async () => {
    const { fill, submit, createMovie, element } = await setup();
    await submit();
    expect(createMovie).not.toHaveBeenCalled();
    await fill('input[type="text"]', '   ');
    await fill('input[type="number"]', '2025.5');
    expect(element.textContent).toContain('whole number');
    await submit();
    expect(createMovie).not.toHaveBeenCalled();
    await fill('input[type="text"]', '  How to Train Your Dragon  ');
    await fill('input[type="number"]', '2025');
    await submit();
    expect(createMovie).toHaveBeenCalledExactlyOnceWith({
      title: 'How to Train Your Dragon',
      year: 2025,
      language: 'it-IT',
    });
  });

  it('shows API errors beneath all affected fields and removes them when values change', async () => {
    const { fill, submit, error, fixture, element } = await setup();
    await fill('input[type="text"]', 'Dragon');
    await fill('input[type="number"]', '2025');
    await submit();
    error.set({
      code: 'validation',
      fieldErrors: {
        title: ['Title rejected'],
        year: ['Year rejected'],
        language: ['Language rejected'],
      },
    });
    await fixture.whenStable();
    expect(element.querySelector('app-text-input')?.textContent).toContain('Title rejected');
    expect(element.querySelector('app-number-input')?.textContent).toContain('Year rejected');
    expect(element.querySelector('app-select-field')?.textContent).toContain('Language rejected');
    expect(element.querySelector('app-select button')?.getAttribute('aria-invalid')).toBe('true');
    await fill('input[type="text"]', 'Different title');
    expect(element.textContent).not.toContain('Title rejected');
    expect(element.textContent).toContain('Year rejected');
  });

  it('blocks duplicate submissions while pending and preserves values after failure', async () => {
    const { fill, submit, busy, error, fixture, element, createMovie } = await setup();
    await fill('input[type="text"]', 'Dragon');
    await fill('input[type="number"]', '2025');
    await submit();
    busy.set(true);
    await fixture.whenStable();
    expect(element.querySelector('fieldset')?.disabled).toBe(true);
    expect(element.querySelector<HTMLButtonElement>('app-select button')?.disabled).toBe(true);
    await submit();
    expect(createMovie).toHaveBeenCalledTimes(1);
    busy.set(false);
    error.set({ code: 'network' });
    await fixture.whenStable();
    expect(element.querySelector<HTMLInputElement>('input[type="text"]')?.value).toBe('Dragon');
    expect(element.querySelector<HTMLInputElement>('input[type="number"]')?.value).toBe('2025');
  });
});
