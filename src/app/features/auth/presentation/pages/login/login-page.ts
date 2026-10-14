import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
  type InputSignal,
} from '@angular/core';
import { AuthFacade } from '../../../application/state/facades/auth.facade';
import { AuthNavigationService } from '../../routing/auth-navigation.service';
import { LoginForm } from '../../components/login-form/login-form';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly authFacade = inject(AuthFacade);
  private readonly authNavigation = inject(AuthNavigationService);

  protected readonly navigating = signal(false);

  readonly returnUrl: InputSignal<string> = input<string>('');

  constructor() {
    effect(() => {
      if (this.authFacade.data.isAuthenticated()) {
        untracked(() => {
          void this.navigateAfterLogin(this.returnUrl());
        });
      }
    });
  }

  private async navigateAfterLogin(returnUrl: string): Promise<void> {
    if (this.navigating()) {
      return;
    }
    this.navigating.set(true);
    try {
      await this.authNavigation.navigateAfterLogin(returnUrl);
    } finally {
      this.navigating.set(false);
    }
  }
}
