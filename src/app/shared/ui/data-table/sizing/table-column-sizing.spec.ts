import { fitTableColumns } from './fit-table-columns';
import { resizeTableColumns } from './resize-table-columns';
import type { DataTableColumnSize } from './data-table-column-size';

const columns: readonly DataTableColumnSize[] = [
  { id: 'title', size: 440, min: 260, max: 10000, resizable: true },
  { id: 'genres', size: 280, min: 180, max: 800, resizable: true },
  { id: 'externalId', size: 160, min: 100, max: 800, resizable: true },
  { id: 'actions', size: 100, min: 100, max: 100, resizable: false },
];

describe('Table column layout', () => {
  it('fills wide viewports with data columns and keeps actions fixed', () => {
    for (const width of [1200, 1920, 4000]) {
      const sizes = fitTableColumns(columns, width);
      expect(Object.values(sizes).reduce((sum, size) => sum + size, 0)).toBeCloseTo(width);
      expect(sizes['actions']).toBe(100);
      expect(sizes['genres']).toBeLessThanOrEqual(800);
      expect(sizes['externalId']).toBeLessThanOrEqual(800);
    }
  });

  it('preserves readable widths and horizontal scrolling in narrow viewports', () => {
    expect(fitTableColumns(columns, 390)).toEqual({
      title: 440,
      genres: 280,
      externalId: 160,
      actions: 100,
    });
  });

  it('adapts to a resized viewport without violating readable minimum widths', () => {
    expect(fitTableColumns(columns, 390, true)).toEqual({
      title: 260,
      genres: 180,
      externalId: 100,
      actions: 100,
    });
    const sizes = fitTableColumns(columns, 800, true);
    expect(Object.values(sizes).reduce((sum, size) => sum + size, 0)).toBeCloseTo(800);
  });

  it('moves only the dragged boundary, preserving subsequent columns and total width', () => {
    expect(resizeTableColumns(columns, 'title', 50, 980)).toEqual({
      title: 490,
      genres: 230,
      externalId: 160,
      actions: 100,
    });
    expect(resizeTableColumns(columns, 'genres', 50, 980)).toEqual({
      title: 440,
      genres: 330,
      externalId: 110,
      actions: 100,
    });
  });

  it('clamps both neighbors and never opens a gap before actions', () => {
    expect(resizeTableColumns(columns, 'genres', 400, 980)['genres']).toBe(340);
    expect(resizeTableColumns(columns, 'title', -900, 980)['title']).toBe(260);
    expect(resizeTableColumns(columns, 'externalId', -50, 980)['externalId']).toBe(160);
    expect(resizeTableColumns(columns, 'externalId', 50, 980)['externalId']).toBe(210);
    expect(resizeTableColumns(columns, 'externalId', -50, 900)['externalId']).toBe(110);
  });

  it('fills the viewport after optional columns are hidden', () => {
    const visible = columns.filter((column) => column.id === 'title' || column.id === 'actions');
    expect(fitTableColumns(visible, 1400)).toEqual({ title: 1300, actions: 100 });
  });
});
