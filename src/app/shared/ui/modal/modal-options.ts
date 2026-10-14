import type { Injector } from '@angular/core';

export interface ModalOptions {
  /** Pass the opening component's injector to retain feature-scoped providers. */
  readonly injector: Injector;
  readonly disableClose?: boolean;
}
