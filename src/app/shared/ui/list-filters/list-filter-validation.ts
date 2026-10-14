import type { ListFilterField } from './list-filter-field';
export function invalidListFilter(
  field: ListFilterField,
  values: Readonly<Record<string, string>>,
): boolean {
  const value = values[field.key] ?? '';
  if (value === '') {
    return false;
  }
  if (field.kind === 'select') {
    return !field.options?.some((option) => option.value === value);
  }
  const number = Number(value);
  if (
    !Number.isInteger(number) ||
    (field.min !== undefined && number < field.min) ||
    (field.max !== undefined && number > field.max)
  ) {
    return true;
  }
  const start = field.rangeStartKey ? values[field.rangeStartKey] : undefined;
  return start !== undefined && start !== '' && number < Number(start);
}
