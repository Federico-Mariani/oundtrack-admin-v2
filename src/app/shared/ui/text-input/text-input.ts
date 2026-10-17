import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormField, type Field } from '@angular/forms/signals';
import { HlmInput } from '@spartan-ng/helm/input';
import { FieldError } from '../field-error/field-error';
@Component({
  selector: 'app-text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, HlmInput, FieldError],
  templateUrl: './text-input.html',
  host: { class: 'block min-w-0' },
})
export class TextInput {
  private static nextId = 0;
  readonly formField = input.required<Field<string>>();
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly comfortable = input(false);
  readonly messages = input<ReadonlyArray<string>>([]);
  readonly placeholder = input('');
  readonly type = input<'text' | 'search'>('text');
  readonly inputMode = input<'text' | 'numeric' | 'search'>('text');
  readonly hideLabel = input(false);
  protected readonly id = `text-input-${String(TextInput.nextId++)}`;
  protected readonly errors = computed(() => {
    const field = this.formField()();
    return [
      ...(field.dirty() || field.touched() ? field.errors() : []),
      ...this.messages().map((message) => ({ kind: 'server', message })),
    ];
  });
}
