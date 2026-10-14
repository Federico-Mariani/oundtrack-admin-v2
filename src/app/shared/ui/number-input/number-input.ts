import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Field } from '@angular/forms/signals';
import { HlmInput } from '@spartan-ng/helm/input';
import { FieldError } from '../field-error/field-error';

@Component({
  selector: 'app-number-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmInput, FieldError],
  templateUrl: './number-input.html',
  host: { class: 'block min-w-0' },
})
export class NumberInput {
  private static nextId = 0;
  readonly formField = input.required<Field<string>>();
  readonly label = input.required<string>();
  readonly min = input<number>();
  readonly max = input<number>();
  protected readonly id = `number-input-${String(NumberInput.nextId++)}`;
  protected readonly errors = computed(() => {
    const field = this.formField()();
    return field.dirty() || field.touched() ? field.errors() : [];
  });
  protected change(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const field = this.formField()();
    field.value.set(event.target.value);
    field.markAsDirty();
  }
}
