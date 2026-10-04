import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import {
  type FormControl,
  type FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from '../../../application/state/facades/auth.facade';
import type { LoginCredentials } from '../../../domain/models/login-credentials';
import { RETURN_URL_QUERY_PARAM } from '../../auth.paths';

interface LoginForm {
  readonly email: FormControl<string>;
  readonly password: FormControl<string>;
}

const DEFAULT_RETURN_URL = '/';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly auth = inject(AuthFacade);
  protected readonly isLoggingIn = this.auth.loadingStatuses.isLoggingIn;
  protected readonly loginError = this.auth.errorStatuses.login;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly form: FormGroup<LoginForm> = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.auth.data.isAuthenticated()) {
        void this.router.navigateByUrl(this.returnUrl());
      }
    });
  }

  protected submit(): void {
    if (this.form.invalid || this.isLoggingIn()) {
      this.form.markAllAsTouched();
      return;
    }

    this.login(this.form.getRawValue());
  }

  private login(credentials: LoginCredentials): void {
    this.auth.actions.login(credentials);
  }

  /** Only same-origin relative paths are honoured to avoid open redirects. */
  private returnUrl(): string {
    const requested = this.route.snapshot.queryParamMap.get(RETURN_URL_QUERY_PARAM);

    return requested?.startsWith('/') && !requested.startsWith('//')
      ? requested
      : DEFAULT_RETURN_URL;
  }
}
