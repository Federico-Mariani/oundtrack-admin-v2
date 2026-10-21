import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormField, type Field } from '@angular/forms/signals';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { FieldError } from '../field-error/field-error';
@Component({
  selector: 'app-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, HlmTextarea, FieldError],
  template: ` <div class="space-y-2.5">
    <label class="block text-sm font-medium" [for]="id">{{ label() }}</label>
    <textarea
      hlmTextarea
      class="min-h-32 w-full resize-y"
      [id]="id"
      [formField]="formField()"
      [attr.aria-invalid]="errors().length > 0"
      [attr.aria-describedby]="id + '-errors'"
    ></textarea>
    <app-field-error [id]="id + '-errors'" [errors]="errors()" />
  </div>`,
})
export class Textarea {
  private static nextId = 0;
  readonly formField = input.required<Field<string>>();
  readonly label = input.required<string>();
  readonly messages = input<ReadonlyArray<string>>([]);
  protected readonly id = `textarea-${String(Textarea.nextId++)}`;
  protected readonly errors = computed(() =>
    this.messages().map((message) => ({ kind: 'server', message })),
  );
}
