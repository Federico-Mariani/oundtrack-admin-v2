import { inject, type ProviderToken } from '@angular/core';

/** The four injectable building blocks every feature facade is made of. */
export interface StoreFacadeParts<DATA, LOADINGS, ERRORS, ACTIONS> {
  readonly data: ProviderToken<DATA>;
  readonly loadingStatuses: ProviderToken<LOADINGS>;
  readonly errorStatuses: ProviderToken<ERRORS>;
  readonly actions: ProviderToken<ACTIONS>;
}

/**
 * Shape shared by every feature facade: read-only data, loading and error
 * statuses, plus the intents the UI can dispatch.
 *
 * Subclasses only list the micro-facade classes to compose; the parts are
 * resolved through Angular DI during construction, so no feature repeats the
 * `inject(...)` wiring and tests can still override any part with a provider.
 * The abstraction knows nothing about NgRx or any bounded context.
 */
export abstract class StoreFacade<DATA, LOADINGS, ERRORS, ACTIONS> {
  readonly data: DATA;
  readonly loadingStatuses: LOADINGS;
  readonly errorStatuses: ERRORS;
  readonly actions: ACTIONS;

  protected constructor(parts: StoreFacadeParts<DATA, LOADINGS, ERRORS, ACTIONS>) {
    this.data = inject(parts.data);
    this.loadingStatuses = inject(parts.loadingStatuses);
    this.errorStatuses = inject(parts.errorStatuses);
    this.actions = inject(parts.actions);
  }
}
