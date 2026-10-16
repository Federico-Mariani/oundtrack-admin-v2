import { inject, type ProviderToken } from '@angular/core';

export interface StoreFacadeParts<DATA, REQUESTS, ACTIONS> {
  readonly data: ProviderToken<DATA>;
  readonly requests: ProviderToken<REQUESTS>;
  readonly actions: ProviderToken<ACTIONS>;
}

export abstract class StoreFacade<DATA, REQUESTS, ACTIONS> {
  readonly data: DATA;
  readonly requests: REQUESTS;
  readonly actions: ACTIONS;

  protected constructor(parts: StoreFacadeParts<DATA, REQUESTS, ACTIONS>) {
    this.data = inject(parts.data);
    this.requests = inject(parts.requests);
    this.actions = inject(parts.actions);
  }
}
