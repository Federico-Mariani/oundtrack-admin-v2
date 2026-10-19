import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmFieldSet, HlmFieldLegend, HlmFieldDescription } from '@spartan-ng/helm/field';
@Component({
  selector: 'app-form-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmFieldSet, HlmFieldLegend, HlmFieldDescription],
  host: { class: 'block min-w-0' },
  template: `
    <fieldset hlmFieldSet class="min-w-0 gap-4" [attr.aria-describedby]="description() ? id : null">
      <legend hlmFieldLegend class="mb-1 text-sm font-semibold">{{ title() }}</legend>
      @if (description()) {
        <p hlmFieldDescription [id]="id" class="text-sm leading-relaxed">{{ description() }}</p>
      }
      <ng-content />
    </fieldset>
  `,
})
export class FormSection {
  private static nextId = 0;
  protected readonly id = `form-section-${String(FormSection.nextId++)}`;
  readonly title = input.required<string>();
  readonly description = input('');
}
