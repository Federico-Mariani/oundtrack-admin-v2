import type { SelectItem } from '@shared/interfaces/select-item';
export interface ListFilterField {
  readonly key: string;
  readonly label: string;
  readonly kind: 'number' | 'select';
  readonly options?: SelectItem[];
  readonly min?: number;
  readonly max?: number;
  readonly rangeStartKey?: string;
}
