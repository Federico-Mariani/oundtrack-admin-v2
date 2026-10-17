import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmLabel } from '@spartan-ng/helm/label';
@Component({
  selector: 'app-checkbox-choice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCheckbox, HlmLabel],
  host: { class: 'block min-w-0' },
  template: `
    <label
      hlmLabel
      class="flex min-h-12 w-full items-center gap-3 rounded-md p-3.5 transition-colors"
      [class.border]="outlined()"
      [class.border-primary/40]="checked() && !disabled()"
      [class.bg-primary/5]="checked() && !disabled()"
      [class.opacity-50]="disabled()"
      [for]="id"
    >
      <hlm-checkbox
        [inputId]="id"
        [checked]="checked()"
        [indeterminate]="indeterminate()"
        [disabled]="disabled()"
        (checkedChange)="changed.emit($event)"
      />
      <span class="min-w-0 space-y-1"
        ><span class="block text-sm font-medium leading-snug">{{ label() }}</span>
        @if (description()) {
          <span class="block text-xs font-normal leading-relaxed text-muted-foreground">{{
            description()
          }}</span>
        }
      </span>
    </label>
  `,
})
export class CheckboxChoice {
  private static nextId = 0;
  protected readonly id = `checkbox-choice-${String(CheckboxChoice.nextId++)}`;
  readonly label = input.required<string>();
  readonly description = input('');
  readonly checked = input(false);
  readonly indeterminate = input(false);
  readonly disabled = input(false);
  readonly outlined = input(true);
  readonly changed = output<boolean>();
}
