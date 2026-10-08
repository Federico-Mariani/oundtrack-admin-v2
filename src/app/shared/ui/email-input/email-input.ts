import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { type Field, FormField, type ValidationError } from '@angular/forms/signals';
import { provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmField, HlmFieldLabel } from '@spartan-ng/helm/field';
import { FieldError } from '@shared/ui/field-error/field-error';

@Component({
  selector: 'app-email-input',
  templateUrl: './email-input.html',
  imports: [HlmInputGroupImports, HlmFieldLabel, HlmField, FormField, FieldError],
  providers: [provideIcons({ lucideEye, lucideEyeOff })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailInput {
  readonly formField = input.required<Field<string>>();
  readonly errorsData = input<ValidationError[]>();
  readonly placeholder = input<string>('email@gmail.com');

  readonly touch = output();
}
