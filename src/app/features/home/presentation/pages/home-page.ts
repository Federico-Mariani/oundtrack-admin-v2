import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_PATHS, AuthFacade } from '@features/auth';

@Component({
  selector: 'app-home-page',
  template: `
    <h1>Welcome{{ userFullName() ? ', ' + userFullName() : '' }}</h1>

    @if (isLoadingCurrentUser()) {
      <p>Loading your profile…</p>
    }

    <button type="button" (click)="logout()">Sign out</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly auth = inject(AuthFacade);
  protected readonly userFullName = this.auth.data.userFullName;
  protected readonly isLoadingCurrentUser = this.auth.loadingStatuses.isLoadingCurrentUser;
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.actions.logout();
    void this.router.navigate([`/${AUTH_PATHS.login}`]);
  }
}
