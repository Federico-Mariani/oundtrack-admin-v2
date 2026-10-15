import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTransloco, provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { of } from 'rxjs';
import validation from '@app/core/i18n/translations/en/validation.json';
import { DEFAULT_MOVIES_LIST_QUERY } from '../../../domain/models/movies-list-query.model';
import type { MoviesFilterFormModel } from '../../models/movies-filter-form.model';
import { applyMovieFilterValues } from '../../mappers/movie-filter-values.mapper';
import { moviesTranslationsLoader } from '../../i18n/movies-translations.loader';
import { MoviesFilters } from './movies-filters';

@Component({
  selector: 'app-filter-test-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoviesFilters, TranslocoDirective],
  providers: [provideTranslocoScope({ scope: 'movies', loader: moviesTranslationsLoader })],
  template: `<ng-container *transloco="let t"
    ><app-movies-filters
      [query]="query()"
      (filtersChange)="change($event)"
      (resetFilters)="reset()"
  /></ng-container>`,
})
class FilterTestHost {
  readonly query = signal({ ...DEFAULT_MOVIES_LIST_QUERY, page: 3 });
  readonly changes: Array<MoviesFilterFormModel> = [];
  change(values: MoviesFilterFormModel): void {
    this.changes.push(values);
    this.query.set(applyMovieFilterValues(this.query(), values));
  }
  reset(): void {
    this.query.set({ ...DEFAULT_MOVIES_LIST_QUERY });
  }
}
class EmptyLoader {
  getTranslation() {
    return of({ validation });
  }
}
async function setup() {
  TestBed.configureTestingModule({
    imports: [FilterTestHost],
    providers: [
      provideTransloco({
        config: { availableLangs: ['en', 'it'], defaultLang: 'en', prodMode: true },
        loader: EmptyLoader,
      }),
    ],
  });
  const fixture = TestBed.createComponent(FilterTestHost);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  await vi.waitFor(() => {
    expect(element.querySelectorAll('input')).toHaveLength(4);
  });
  const field = (label: string): HTMLInputElement => {
    const node = Array.from(element.querySelectorAll('label')).find(
      (l) => l.textContent.trim() === label,
    )!;
    return element.querySelector<HTMLInputElement>(`#${node.htmlFor}`)!;
  };
  const fill = async (label: string, value: string): Promise<void> => {
    const input = field(label);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  };
  return { fixture, element, field, fill, host: fixture.componentInstance };
}
describe('Movies reactive filters', () => {
  it('uses the form controller to emit valid criteria immediately, resets pages and preserves drafts on pagination', async () => {
    const { fill, host, fixture, field, element } = await setup();
    expect(host.changes).toHaveLength(0);
    await fill('Year from', '1990');
    expect(host.query().filters.releaseYearFrom).toBe(1990);
    expect(host.query().page).toBe(1);
    await fill('Year to', '1980');
    const count = host.changes.length;
    expect(field('Year to').getAttribute('aria-invalid')).toBe('true');
    host.query.update((q) => ({ ...q, page: 2 }));
    await fixture.whenStable();
    expect(field('Year to').value).toBe('1980');
    expect(host.changes).toHaveLength(count);
    await fill('Year to', '2005');
    expect(host.query().filters.releaseYearTo).toBe(2005);
    expect(element.textContent).not.toContain('Apply');
    expect(element.textContent).not.toContain('Metadata language');
  });
  it('clears invalid drafts and all criteria without a submission button or feedback loop', async () => {
    const { fill, host, fixture, field, element } = await setup();
    await fill('Search the catalog…', 'Matrix');
    await fill('External ID', '-1');
    element.querySelector<HTMLButtonElement>('button[aria-label="Clear all filters"]')!.click();
    await fixture.whenStable();
    expect(host.query().search).toBe('');
    expect(host.query().filters).toEqual({});
    expect(field('External ID').value).toBe('');
    expect(field('External ID').getAttribute('aria-invalid')).not.toBe('true');
    const count = host.changes.length;
    await fixture.whenStable();
    expect(host.changes).toHaveLength(count);
  });
  it('rejects fractional and out-of-range criteria before emitting', async () => {
    const { fill, host } = await setup();
    await fill('Year from', '2.5');
    await fill('Year from', '9999');
    await fill('External ID', '2147483648');
    expect(host.changes).toHaveLength(0);
  });
});
