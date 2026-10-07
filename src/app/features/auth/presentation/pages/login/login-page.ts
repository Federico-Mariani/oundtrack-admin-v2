import {ChangeDetectionStrategy, Component, effect, inject, input, InputSignal,} from '@angular/core';
import {type FormControl, ReactiveFormsModule,} from '@angular/forms';
import {AuthFacade, AuthNavigationService,} from '@features/auth';
import {SignalFormCustomControlDemo} from '@features/auth/presentation/components/login-form/login-form';

interface LoginForm {
    readonly email: FormControl<string>;
    readonly password: FormControl<string>;
}

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule, SignalFormCustomControlDemo,],
    templateUrl: './login-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
    private readonly authFacade = inject(AuthFacade);
    private readonly authNavigation = inject(AuthNavigationService);

    readonly returnUrl: InputSignal<string> = input<string>('');

    protected readonly isLoggingIn =
        this.authFacade.loadingStatuses.isLoggingIn;
    protected readonly loginError =
        this.authFacade.errorStatuses.login;

    constructor() {
        effect(() => {
            if (this.authFacade.data.isAuthenticated()) {
                void this.authNavigation.navigateAfterLogin(
                    this.returnUrl(),
                );
            }
        });
    }
}
