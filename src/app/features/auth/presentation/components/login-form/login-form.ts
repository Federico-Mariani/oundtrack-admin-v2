import {Component, computed, inject, type Signal} from '@angular/core';
import {FormField, FormRoot} from '@angular/forms/signals';
import {HlmCardImports} from '@spartan-ng/helm/card';
import {HlmFieldImports} from '@spartan-ng/helm/field';
import {PasswordInput} from '@shared/ui/password-input/password-input';
import {AppFormController} from '@app/core/forms/app-form-controller';
import {AppFormField} from '@app/core/forms/app-form-field';
import type {LoginFormModel} from '../../models/login-form-model';
import {RequiredInputRule} from '@app/core/forms/rules/required-input-rule';
import {EmailInput} from '@shared/ui/email-input/email-input';
import {EmailInputRule} from '@app/core/forms/rules/email-input-rule';
import {AuthFacade} from '../../../application/state/facades/auth.facade';
import {TranslocoDirective} from '@jsverse/transloco';
import {AUTH_I18N_SCOPE} from '../../i18n/auth-translations.loader';
import {AUTH_LOGIN_TRANSLATION_KEYS} from '../../i18n/auth-login-translation-keys';
import {Button} from '@shared/ui/button/button';
import {NotificationService} from "@app/core/notifications/notification.service";

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.html',
    imports: [
        FormRoot,
        FormField,
        HlmCardImports,
        HlmFieldImports,
        PasswordInput,
        EmailInput,
        TranslocoDirective,
        Button,
    ],
    host: {class: 'w-full sm:max-w-md'},
})
export class LoginForm {
    private readonly authFacade = inject(AuthFacade);
    private readonly n = inject(NotificationService);

    protected readonly i18nScope = AUTH_I18N_SCOPE;
    protected readonly keys = AUTH_LOGIN_TRANSLATION_KEYS;

    protected readonly isLoggingIn = computed(() => this.authFacade.loadingStatuses.isLoggingIn());
    protected readonly loginError = computed(() => this.authFacade.errorStatuses.login());

    private readonly loginFieldErrors = computed(() => this.loginError()?.fieldErrors);
    protected readonly canSubmit: Signal<boolean> = computed(() => {
        return this.loginFormController.form().valid();
    });

    protected readonly loginFormController = new AppFormController<LoginFormModel>(
        [
            new AppFormField('email', [new RequiredInputRule(), new EmailInputRule()]),
            new AppFormField('password', [new RequiredInputRule()]),
        ],
        () => {
            this.onSubmit();
        },
        this.loginFieldErrors,
    );

    protected onSubmit(): void {
        this.authFacade.actions.login({
            email: this.loginFormController.model().email,
            password: this.loginFormController.model().password,
        });
    }

    protected reset(): void {
        this.loginFormController.form().reset({email: '', password: ''});
    }
}
