import { invalidListFilter } from './list-filter-validation';
describe('Reusable filter validation', () => {
  const end = {
    key: 'to',
    label: 'To',
    kind: 'number' as const,
    min: 1,
    max: 9998,
    rangeStartKey: 'from',
  };
  it('rejects invalid numbers and reversed ranges before applying', () => {
    for (const to of ['0', '10000', '2.5', 'abc', '1999']) {
      expect(invalidListFilter(end, { from: '2000', to })).toBe(true);
    }
    expect(invalidListFilter(end, { from: '2000', to: '2000' })).toBe(false);
    expect(invalidListFilter(end, { to: '' })).toBe(false);
  });
  it('only accepts configured select options', () => {
    const field = {
      key: 'state',
      label: 'State',
      kind: 'select' as const,
      options: [{ value: 'ready', label: 'Ready' }],
    };
    expect(invalidListFilter(field, { state: 'ready' })).toBe(false);
    expect(invalidListFilter(field, { state: 'other' })).toBe(true);
  });
});
