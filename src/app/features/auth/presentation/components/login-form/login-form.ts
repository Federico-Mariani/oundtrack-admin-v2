import {Component, computed, inject, Signal} from '@angular/core';
import {FormField, FormRoot} from '@angular/forms/signals';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {HlmCardImports} from '@spartan-ng/helm/card';
import {HlmFieldImports} from '@spartan-ng/helm/field';
import {PasswordInput} from '@app/presentation/components/inputs/password-input/password-input';
import {AppFormController} from '@app/core/forms/app-form-controller';
import {AppFormField} from '@app/core/forms/app-form-field';
import {LoginFormModel} from '@features/auth/presentation/models/login-form-model';
import {RequiredInputRule} from '@app/core/forms/rules/required-input-rule';
import {EmailInput} from "@app/presentation/components/inputs/email-input/email-input";
import {EmailInputRule} from "@app/core/forms/rules/email-input-rule";
import {AuthFacade} from "@features/auth";

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.html',
    imports: [FormRoot, FormField, HlmCardImports, HlmFieldImports, HlmButtonImports, PasswordInput, EmailInput],
    host: {class: 'w-full sm:max-w-md'},
})
export class SignalFormCustomControlDemo {
    private readonly authFacade = inject(AuthFacade);

    private readonly loginFieldErrors = computed(() => this.authFacade.errorStatuses.login()?.fieldErrors);

    protected readonly loginFormController =
        new AppFormController<LoginFormModel>(
            [
                new AppFormField('email', [new RequiredInputRule(), new EmailInputRule()]),
                new AppFormField('password', [new RequiredInputRule()])
            ],
            () => this.onSubmit(),
            this.loginFieldErrors
        );

    protected readonly canSubmit: Signal<boolean> = computed(() => {
        return this.loginFormController.form().valid();
    });

    protected onSubmit(): void {
        this.authFacade.actions.login({
            email: this.loginFormController.model().email,
            password: this.loginFormController.model().password
        });
    }

    protected reset(): void {
        this.loginFormController.form().reset({email: '', password: ''});
    }
}
