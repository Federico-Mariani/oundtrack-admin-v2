import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Field } from '@angular/forms/signals';
import type { SelectItem } from '@shared/interfaces/select-item';
import { Select } from '../select/select';
@Component({
  selector: 'app-select-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Select],
  templateUrl: './select-field.html',
  host: { class: 'block min-w-0' },
})
export class SelectField {
  readonly formField = input.required<Field<string>>();
  readonly label = input.required<string>();
  readonly hideLabel = input(false);
  readonly items = input.required<SelectItem[]>();
  protected change(value: string): void {
    const field = this.formField()();
    field.value.set(value);
    field.markAsDirty();
    field.markAsTouched();
  }
}
