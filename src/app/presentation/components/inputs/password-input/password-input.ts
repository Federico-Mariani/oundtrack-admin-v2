import {ChangeDetectionStrategy, Component, computed, input, output, signal} from '@angular/core';
import {type Field, FormField, type ValidationError} from '@angular/forms/signals';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {lucideEye, lucideEyeOff} from '@ng-icons/lucide';
import {HlmInputGroupImports} from '@spartan-ng/helm/input-group';
import {HlmField, HlmFieldError, HlmFieldLabel} from "@spartan-ng/helm/field";

@Component({
    selector: 'app-password-input',
    templateUrl: './password-input.html',
    imports: [HlmInputGroupImports, NgIcon, HlmFieldError, HlmFieldLabel, HlmField, FormField],
    providers: [provideIcons({lucideEye, lucideEyeOff})],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInput {
    public readonly formField = input.required<Field<string>>();
    public readonly errorsData = input<ValidationError[]>();
    public readonly placeholder = input<string>('********');

    public readonly touch = output<void>();

    protected readonly inputType = signal<'text' | 'password'>('password');

    protected readonly icon = computed(() => (this.inputType() === 'password' ? 'lucideEye' : 'lucideEyeOff'));

    public togglePasswordVisibility() {
        this.inputType.set(this.inputType() === 'password' ? 'text' : 'password');
    }
}
