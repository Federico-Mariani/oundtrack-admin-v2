import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {type Field, FormField, type ValidationError} from '@angular/forms/signals';
import {provideIcons} from '@ng-icons/core';
import {lucideEye, lucideEyeOff} from '@ng-icons/lucide';
import {HlmInputGroupImports} from '@spartan-ng/helm/input-group';
import {HlmField, HlmFieldError, HlmFieldLabel} from "@spartan-ng/helm/field";

@Component({
    selector: 'app-email-input',
    templateUrl: './email-input.html',
    imports: [HlmInputGroupImports, HlmFieldError, HlmFieldLabel, HlmField, FormField],
    providers: [provideIcons({lucideEye, lucideEyeOff})],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailInput {
    public readonly formField = input.required<Field<string>>();
    public readonly errorsData = input<ValidationError[]>();
    public readonly placeholder = input<string>('email@gmail.com');

    public readonly touch = output<void>();
}
