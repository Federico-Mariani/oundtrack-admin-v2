import type { ViewContainerRef } from '@angular/core';

export interface ModalOptions {
  /** Pass the opening component's view container to retain feature-scoped providers. */
  readonly viewContainerRef: ViewContainerRef;
  readonly disableClose?: boolean;
}
