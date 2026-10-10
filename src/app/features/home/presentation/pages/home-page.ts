import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthFacade, AuthNavigationService } from '@features/auth';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly auth = inject(AuthFacade);
  private readonly authNavigation = inject(AuthNavigationService);

  protected readonly isLoadingCurrentUser = this.auth.loadingStatuses.isLoadingCurrentUser;

  protected logout(): void {
    this.auth.actions.logout();
    void this.authNavigation.goToLogin();
  }
}
