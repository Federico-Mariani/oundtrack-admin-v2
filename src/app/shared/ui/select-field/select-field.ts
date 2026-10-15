import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Field } from '@angular/forms/signals';
import type { SelectItem } from '@shared/interfaces/select-item';
import { FieldError } from '../field-error/field-error';
import { Select } from '../select/select';
@Component({
  selector: 'app-select-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Select, FieldError],
  templateUrl: './select-field.html',
  host: { class: 'block min-w-0' },
})
export class SelectField {
  private static nextId = 0;
  protected readonly errorId = `select-errors-${String(SelectField.nextId++)}`;
  readonly disabled = input(false);
  protected readonly errors = computed(() => {
    const field = this.formField()();
    return field.dirty() ||
      field.touched() ||
      field.errors().some((error) => error.kind === 'server')
      ? field.errors()
      : [];
  });
  readonly formField = input.required<Field<string>>();
  readonly label = input.required<string>();
  readonly hideLabel = input(false);
  readonly items = input.required<Array<SelectItem>>();
  protected change(value: string): void {
    const field = this.formField()();
    field.value.set(value);
    field.markAsDirty();
    field.markAsTouched();
  }
}
