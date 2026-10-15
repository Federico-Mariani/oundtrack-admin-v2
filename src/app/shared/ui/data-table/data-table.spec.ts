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
  helper.accessor('name', { header: 'Name', enableHiding: false }),
  helper.accessor('year', { header: 'Year' }),
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
    fixture.componentRef.setInput('remote', {
      page: 1,
      limit: 20,
      total: 100,
      search: '',
      filtered: false,
    });
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
      expect(rows()).toHaveLength(26);
    });
  });

  function button(label: string): HTMLButtonElement {
    const result = element.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
    expect(result, `Missing button: ${label}`).not.toBeNull();
    return result!;
  }

  function rows(): Array<HTMLTableRowElement> {
    return Array.from(element.querySelectorAll<HTMLTableRowElement>('tbody tr[data-row-id]'));
  }

  it('emits controlled pagination and leaves server rows untouched', async () => {
    const changed = vi.fn();
    fixture.componentInstance.pageChange.subscribe(changed);
    button('Next page').click();
    await fixture.whenStable();
    expect(changed).toHaveBeenCalledWith({ page: 2, limit: 20 });
    expect(rows()).toHaveLength(26);
    fixture.componentRef.setInput('remote', {
      page: 3,
      limit: 20,
      total: 100,
      search: 'unmatched',
      filtered: true,
    });
    fixture.componentRef.setInput('data', [
      { id: 'server', name: 'Returned by server', year: 2020 },
    ]);
    await fixture.whenStable();
    expect(rows()).toHaveLength(1);
    expect(element.querySelector('thead button[title="Change sort order"]')).toBeNull();
    expect(element.querySelector('input[type="search"]')).toBeNull();
    expect(element.textContent).toContain('of 100 records');
  });
  it('emits one page-size change resetting the page and disables navigation while loading', async () => {
    const changed = vi.fn();
    fixture.componentInstance.pageChange.subscribe(changed);
    element.querySelector<HTMLButtonElement>('app-select button')!.click();
    await fixture.whenStable();
    const option = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]')).find(
      (item) => item.textContent.trim() === '25',
    )!;
    option.click();
    await fixture.whenStable();
    expect(changed).toHaveBeenCalledExactlyOnceWith({ page: 1, limit: 25 });
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();
    expect(button('Next page').closest('fieldset')?.disabled).toBe(true);
  });

  it.each([
    { page: 1, total: 0 },
    { page: 1, total: 7 },
    { page: 1, total: 20 },
    { page: 3, total: 41 },
  ])('blocks next and last on the final server page: %j', async ({ page, total }) => {
    const changed = vi.fn();
    fixture.componentInstance.pageChange.subscribe(changed);
    fixture.componentRef.setInput('remote', {
      page,
      limit: 20,
      total,
      search: '',
      filtered: false,
    });
    await fixture.whenStable();
    for (const label of ['Next page', 'Last page']) {
      const target = button(label);
      expect(target.disabled).toBe(true);
      target.click();
      target.closest('app-icon-button')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
    expect(changed).not.toHaveBeenCalled();
  });

  it('reacts when the server total changes without changing page or row count', async () => {
    fixture.componentRef.setInput('remote', {
      page: 1,
      limit: 20,
      total: 20,
      search: '',
      filtered: false,
    });
    await fixture.whenStable();
    expect(button('Next page').disabled).toBe(true);
    fixture.componentRef.setInput('remote', {
      page: 1,
      limit: 20,
      total: 21,
      search: '',
      filtered: false,
    });
    await fixture.whenStable();
    expect(button('Next page').disabled).toBe(false);
    expect(element.textContent).toContain('of 21 records');
  });

  it('replaces stale rows with accessible shimmer loading rows and restores the server result', async () => {
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();
    expect(rows()).toHaveLength(0);
    expect(element.querySelectorAll('tr[data-loading-row]')).toHaveLength(10);
    expect(element.querySelectorAll('app-shimmer')).toHaveLength(20);
    expect(element.querySelector('section')?.getAttribute('aria-busy')).toBe('true');
    const changed = vi.fn();
    fixture.componentInstance.pageChange.subscribe(changed);
    button('Next page')
      .closest('app-icon-button')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(changed).not.toHaveBeenCalled();
    fixture.componentRef.setInput('loading', false);
    await fixture.whenStable();
    expect(rows()).toHaveLength(26);
    expect(element.querySelector('app-shimmer')).toBeNull();
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
    expect(element.querySelector('app-data-table-controls app-data-table-pagination')).toBeNull();
    const pagination = element.querySelector('app-data-table-pagination')!;
    expect(
      pagination.compareDocumentPosition(surface) & Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy();
    const widths = (): Array<string> =>
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
    const view = button('View');
    view.click();
    await fixture.whenStable();
    const year = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[role="menuitemcheckbox"]'),
    ).find((item) => item.textContent.includes('Year'))!;
    expect(year).toBeDefined();
    year.click();
    await fixture.whenStable();
    fixture.componentRef.setInput('data', []);
    await fixture.whenStable();
    expect(element.querySelector('tbody td')?.getAttribute('colspan')).toBe('1');
  });

  it('changes row density and resets the view without fetching data', async () => {
    const view = button('View');
    view.click();
    await fixture.whenStable();
    const compact = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'),
    ).find((item) => item.textContent.includes('Compact'))!;
    compact.click();
    await fixture.whenStable();
    expect(element.querySelector('tbody td')?.classList.contains('py-2')).toBe(true);
    const reset = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    ).find((item) => item.textContent.includes('Reset table view'))!;
    reset.click();
    await fixture.whenStable();
    expect(rows()).toHaveLength(26);
    expect(element.querySelector('tbody td')?.classList.contains('py-4')).toBe(true);
  });

  it('updates shared labels when the active language changes', async () => {
    TestBed.inject(TranslocoService).setActiveLang('it');
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(button('Pagina successiva')).toBeDefined();
    });
  });
});
