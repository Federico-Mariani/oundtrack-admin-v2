import { inject, Injectable } from '@angular/core';
import type { AuthRefreshPort } from '../../ports/auth-refresh.port';
import { AuthStoreDataFacade } from './auth-store-data.facade';
import { AuthStoreActionsFacade } from './auth-store-actions.facade';

@Injectable({ providedIn: 'root' })
export class AuthRefreshFacade implements AuthRefreshPort {
  private readonly data = inject(AuthStoreDataFacade);
  private readonly actions = inject(AuthStoreActionsFacade);
  readonly snapshot = this.data.refreshSnapshot;
  readonly changes$ = this.data.refreshChanges$;

  refresh(generation: number): void {
    this.actions.refreshSession(generation);
  }

  expire(generation: number): void {
    this.actions.rejectSession(generation);
  }
}
