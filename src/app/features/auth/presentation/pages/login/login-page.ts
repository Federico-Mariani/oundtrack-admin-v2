import {ChangeDetectionStrategy, Component, effect, inject, input, InputSignal,} from '@angular/core';
import {
  type FormControl,
  type FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {AuthFacade, AuthNavigationService,} from '@features/auth';

interface LoginForm {
  readonly email: FormControl<string>;
  readonly password: FormControl<string>;
}

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly auth = inject(AuthFacade);
  private readonly navigation = inject(AuthNavigationService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly returnUrl: InputSignal<string> = input<string>('');

  protected readonly isLoggingIn =
    this.auth.loadingStatuses.isLoggingIn;
  protected readonly loginError =
    this.auth.errorStatuses.login;
  
  protected readonly form: FormGroup<LoginForm> =
    this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  constructor() {
    effect(() => {
      if (this.auth.data.isAuthenticated()) {
        void this.navigation.navigateAfterLogin(
          this.returnUrl(),
        );
      }
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isLoggingIn()) {
      return;
    }

    this.auth.actions.login(
      this.form.getRawValue(),
    );
  }
}
