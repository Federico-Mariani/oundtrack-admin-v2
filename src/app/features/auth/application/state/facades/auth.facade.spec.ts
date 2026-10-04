import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { authRootState } from '../../../testing/auth-state.fixtures';
import { AuthFacade } from './auth.facade';
import { AuthStoreActionsFacade } from './auth-store-actions.facade';
import { AuthStoreDataFacade } from './auth-store-data.facade';
import { AuthStoreErrorStatusesFacade } from './auth-store-error-statuses.facade';
import { AuthStoreLoadingStatusesFacade } from './auth-store-loading-statuses.facade';

describe('AuthFacade', () => {
  it('composes the four micro-facades through DI', () => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: authRootState() })],
    });

    const facade = TestBed.inject(AuthFacade);

    expect(facade.data).toBe(TestBed.inject(AuthStoreDataFacade));
    expect(facade.loadingStatuses).toBe(TestBed.inject(AuthStoreLoadingStatusesFacade));
    expect(facade.errorStatuses).toBe(TestBed.inject(AuthStoreErrorStatusesFacade));
    expect(facade.actions).toBe(TestBed.inject(AuthStoreActionsFacade));
  });

  it('lets tests replace a single part with a provider', () => {
    const isAuthenticated = signal(true);

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: authRootState() }),
        { provide: AuthStoreDataFacade, useValue: { isAuthenticated } },
      ],
    });

    expect(TestBed.inject(AuthFacade).data.isAuthenticated()).toBe(true);
  });
});
