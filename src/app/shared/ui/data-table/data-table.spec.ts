import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { createColumnHelper } from '@tanstack/angular-table';
import { of } from 'rxjs';
import { DataTable } from './data-table';
import type { DataTableFeatures } from './data-table-features';

interface TestRow {
  readonly id: string;
  readonly name: string;
  readonly year: number;
}

const helper = createColumnHelper<DataTableFeatures, TestRow>();
const columns = helper.columns([
  helper.accessor('name', { header: 'Name', enableHiding: false, sortFn: 'text' }),
  helper.accessor('year', { header: 'Year', sortFn: 'basic' }),
]);

class EmptyTranslationLoader {
  getTranslation() {
    return of({});
  }
}

describe('DataTable interactions', () => {
  let fixture: ComponentFixture<DataTable<TestRow>>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [DataTable],
      providers: [
        provideTransloco({
          config: {
            availableLangs: ['en', 'it'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
            prodMode: true,
          },
          loader: EmptyTranslationLoader,
        }),
      ],
    });
    fixture = TestBed.createComponent(DataTable<TestRow>);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('caption', 'Records');
    fixture.componentRef.setInput('getRowId', (row: TestRow) => row.id);
    fixture.componentRef.setInput(
      'data',
      Array.from({ length: 26 }, (_, index) => ({
        id: `record-${String(index)}`,
        name: `Movie ${String(index).padStart(2, '0')}`,
        year: 2000 + index,
      })),
    );
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(rows()).toHaveLength(10);
    });
  });

  function button(label: string): HTMLButtonElement {
    const result = element.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
    expect(result, `Missing button: ${label}`).not.toBeNull();
    return result!;
  }

  function rows(): HTMLTableRowElement[] {
    return Array.from(element.querySelectorAll<HTMLTableRowElement>('tbody tr[data-row-id]'));
  }

  async function search(value: string): Promise<void> {
    const input = element.querySelector<HTMLInputElement>('input[type="search"]')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('makes every page reachable and changes the page size', async () => {
    expect(rows()).toHaveLength(10);
    button('Next page').click();
    await fixture.whenStable();
    expect(rows()[0]?.dataset['rowId']).toBe('record-10');
    button('Last page').click();
    await fixture.whenStable();
    expect(rows()).toHaveLength(6);
    expect(button('Next page').disabled).toBe(true);
    element.querySelector<HTMLButtonElement>('app-select button')!.click();
    await fixture.whenStable();
    const option = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]')).find(
      (item) => item.textContent.trim() === '25',
    )!;
    option.click();
    await fixture.whenStable();
    expect(rows()).toHaveLength(25);
    expect(rows()[0]?.dataset['rowId']).toBe('record-0');
  });

  it('searches the full collection and returns to the first page', async () => {
    button('Last page').click();
    await fixture.whenStable();
    await search('Movie 03');
    expect(rows()).toHaveLength(1);
    expect(rows()[0]?.dataset['rowId']).toBe('record-3');
    expect(element.textContent).toContain('1–1 of 1 records');
    await search('missing');
    expect(element.textContent).toContain('No matching results');
    button('Clear filters').click();
    await fixture.whenStable();
    expect(rows()).toHaveLength(10);
  });

  it('sorts numerically without changing row identities', async () => {
    const sortButton = element.querySelectorAll<HTMLButtonElement>(
      'thead button[title="Change sort order"]',
    )[1];
    sortButton.click();
    await fixture.whenStable();
    expect(rows()[0]?.dataset['rowId']).toBe('record-25');
    expect(element.querySelector('th[aria-sort="descending"]')).not.toBeNull();
  });

  it('distinguishes loading, errors and an empty collection and emits retry', async () => {
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();
    expect(element.textContent).toContain('Loading records');
    expect(element.textContent).not.toContain('No records yet');
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('errorMessage', 'Connection failed');
    const retry = vi.fn();
    fixture.componentInstance.retry.subscribe(retry);
    await fixture.whenStable();
    const alert = element.querySelector('[role="alert"]')!;
    alert.querySelector('button')!.click();
    expect(retry).toHaveBeenCalledOnce();
    expect(element.textContent).not.toContain('No records yet');
    fixture.componentRef.setInput('errorMessage', null);
    await fixture.whenStable();
    expect(element.textContent).toContain('No records yet');
  });

  it('resizes with the keyboard and resets the column with Enter', async () => {
    const handle = button('Resize column name');
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(element.querySelector('col')?.style.width).toBe('190px');
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(element.querySelector('col')?.style.width).toBe('180px');
  });

  it('places controls outside the bordered table and preserves sibling column widths', async () => {
    const surface = element.querySelector('table')!.parentElement!.parentElement!;
    expect(surface.classList.contains('rounded-xl')).toBe(true);
    expect(surface.querySelector('app-data-table-toolbar')).toBeNull();
    expect(surface.querySelector('app-data-table-pagination')).toBeNull();
    const widths = (): string[] =>
      Array.from(element.querySelectorAll('col')).map((column) => column.style.width);
    const before = widths();
    button('Resize column year').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    await fixture.whenStable();
    expect(widths()).toEqual([before[0], '190px']);
    expect(element.querySelector('table')?.classList.contains('min-w-full')).toBe(false);
  });

  it('keeps the empty-state colspan consistent with visible columns', async () => {
    const view = Array.from(element.querySelectorAll('button')).find((item) =>
      item.textContent.includes('View'),
    )!;
    view.click();
    await fixture.whenStable();
    const year = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[role="menuitemcheckbox"]'),
    ).find((item) => item.textContent.includes('Year'))!;
    expect(year).toBeDefined();
    year.click();
    await fixture.whenStable();
    await search('missing');
    expect(element.querySelector('tbody td')?.getAttribute('colspan')).toBe('1');
  });

  it('changes row density and resets the view without fetching data', async () => {
    const view = Array.from(element.querySelectorAll('button')).find((item) =>
      item.textContent.includes('View'),
    )!;
    view.click();
    await fixture.whenStable();
    const compact = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'),
    ).find((item) => item.textContent.includes('Compact'))!;
    compact.click();
    await fixture.whenStable();
    expect(element.querySelector('tbody td')?.classList.contains('py-2')).toBe(true);
    await search('Movie 03');
    button('Reset table view').click();
    await fixture.whenStable();
    expect(rows()).toHaveLength(10);
    expect(element.querySelector('tbody td')?.classList.contains('py-4')).toBe(true);
    expect(element.querySelector('input')?.value).toBe('');
  });

  it('updates shared labels when the active language changes', async () => {
    TestBed.inject(TranslocoService).setActiveLang('it');
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(element.querySelector('input')?.getAttribute('placeholder')).toBe(
        'Cerca nella tabella…',
      );
    });
    expect(element.textContent).toContain('Righe per pagina');
  });
});
