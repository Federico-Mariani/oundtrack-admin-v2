import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTransloco, provideTranslocoScope } from '@jsverse/transloco';
import { of } from 'rxjs';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { LANGUAGE_OPTIONS } from '@app/core/i18n/language/language-options';
import validation from '@app/core/i18n/translations/en/validation.json';
import type { RequestError } from '@shared/state/request/request-error';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { moviesTranslationsLoader } from '../../i18n/movies-translations.loader';
import { CreateOneMoviePage } from './create-one-movie-page';

class TranslationLoader {
  getTranslation() {
    return of({ validation });
  }
}

async function setup() {
  const busy = signal(false);
  const created = signal(false);
  const error = signal<RequestError | null>(null);
  const createMovie = vi.fn();
  TestBed.configureTestingModule({
    imports: [CreateOneMoviePage],
    providers: [
      provideRouter([]),
      provideTransloco({
        config: { availableLangs: ['en', 'it'], defaultLang: 'en', prodMode: true },
        loader: TranslationLoader,
      }),
      provideTranslocoScope({ scope: 'movies', loader: moviesTranslationsLoader }),
      {
        provide: LanguageService,
        useValue: { options: LANGUAGE_OPTIONS, activeLocale: signal('it-IT') },
      },
      {
        provide: MoviesFacade,
        useValue: {
          data: { movieCreated: created },
          loadingStatuses: { isCreatingMovie: busy },
          errorStatuses: { createMovie: error },
          actions: {
            createMovie,
            resetCreateMovie: () => {
              error.set(null);
              created.set(false);
            },
          },
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(CreateOneMoviePage);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  await vi.waitFor(() => {
    expect(element.querySelector('input[type="number"]')).not.toBeNull();
  });
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
  return { fixture, element, fill, submit, busy, created, error, createMovie };
}

describe('Create movie form', () => {
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

  it('blocks duplicate submissions while pending and clears the form on success', async () => {
    const { fill, submit, busy, created, fixture, element, createMovie } = await setup();
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
    created.set(true);
    await fixture.whenStable();
    expect(element.querySelector<HTMLInputElement>('input[type="text"]')?.value).toBe('');
    expect(element.querySelector<HTMLInputElement>('input[type="number"]')?.value).toBe('');
    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'Movie created successfully',
    );
  });
});
