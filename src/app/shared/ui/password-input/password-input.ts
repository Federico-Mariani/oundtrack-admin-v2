import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { type Field, FormField, type ValidationError } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmField, HlmFieldLabel } from '@spartan-ng/helm/field';
import { FieldError } from '@shared/ui/field-error/field-error';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.html',
  imports: [HlmInputGroupImports, NgIcon, HlmFieldLabel, HlmField, FormField, FieldError],
  providers: [provideIcons({ lucideEye, lucideEyeOff })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInput {
  readonly formField = input.required<Field<string>>();
  readonly placeholder = input<string>('********');

  readonly touch = output();

  protected readonly inputType = signal<'text' | 'password'>('password');

  /**
   * Validation errors are only surfaced once the user has interacted with the
   * field: an untouched field (e.g. an empty required input on first render)
   * is already invalid, but showing that error before any interaction is noise.
   */
  protected readonly visibleErrors = computed<ReadonlyArray<ValidationError>>(() => {
    const field = this.formField()();

    return field.touched() ? field.errors() : [];
  });

  protected readonly icon = computed(() =>
    this.inputType() === 'password' ? 'lucideEye' : 'lucideEyeOff',
  );

  protected togglePasswordVisibility(): void {
    this.inputType.set(this.inputType() === 'password' ? 'text' : 'password');
  }
}
