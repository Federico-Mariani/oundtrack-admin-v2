import { inject, Injectable, DestroyRef, type Type } from '@angular/core';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import type { BrnDialogRef } from '@spartan-ng/brain/dialog';
import type { ModalContent } from './modal-content';
import type { ModalOptions } from './modal-options';

/** Global component-based entry point using Spartan's dialog and overlay lifecycle. */
@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(HlmDialogService);

  open<TParams, TResult>(
    component: Type<ModalContent<TParams, TResult>>,
    params: NoInfer<TParams>,
    options: ModalOptions,
  ): BrnDialogRef<TResult> {
    const ref = this.dialog.open<TResult, { params: TParams }>(component, {
      context: { params },
      viewContainerRef: options.viewContainerRef,
      ariaModal: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      disableClose: options.disableClose ?? false,
      showCloseButton: false,
      contentClass: 'max-h-[calc(100dvh-2rem)] overflow-y-auto',
    });
    const unregister = options.viewContainerRef.injector.get(DestroyRef).onDestroy(() => {
      ref.forceClose();
    });
    ref.closed$.subscribe(() => {
      unregister();
    });
    return ref;
  }
}
