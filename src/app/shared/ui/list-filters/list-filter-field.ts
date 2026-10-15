import type { Field } from '@angular/forms/signals';
import type { SelectItem } from '@shared/interfaces/select-item';
export interface ListFilterField {
  readonly key: string;
  readonly label: string;
  readonly kind: 'number' | 'select';
  readonly field: Field<string>;
  readonly options?: Array<SelectItem>;
}
