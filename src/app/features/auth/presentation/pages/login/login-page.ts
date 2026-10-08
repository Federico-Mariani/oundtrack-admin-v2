import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
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

  readonly returnUrl: InputSignal<string> = input<string>('');

  constructor() {
    effect(() => {
      if (this.authFacade.data.isAuthenticated()) {
        void this.authNavigation.navigateAfterLogin(this.returnUrl());
      }
    });
  }
}
