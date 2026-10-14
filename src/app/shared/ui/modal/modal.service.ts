import { inject, Injectable, DestroyRef, type Type } from '@angular/core';
import { Dialog, type DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import type { ModalContent } from './modal-content';
import type { ModalOptions } from './modal-options';

/** Global component-based entry point. Overlay mechanics stay with Angular CDK. */
@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private nextId = 0;

  open<TParams, TResult>(
    component: Type<ModalContent<TParams, TResult>>,
    params: NoInfer<TParams>,
    options: ModalOptions,
  ): DialogRef<TResult> {
    const id = `app-modal-${String(++this.nextId)}`;
    const ref = this.dialog.open<TResult, TParams>(component, {
      id,
      data: params,
      injector: options.injector,
      ariaLabelledBy: `${id}-title`,
      ariaDescribedBy: `${id}-description`,
      ariaModal: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      disableClose: options.disableClose ?? false,
      closeOnNavigation: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      backdropClass: 'cdk-overlay-dark-backdrop',
      width: 'min(32rem, calc(100vw - 2rem))',
      maxHeight: 'calc(100dvh - 2rem)',
    });
    const unregister = options.injector.get(DestroyRef).onDestroy(() => {
      ref.close();
    });
    ref.closed.subscribe(() => {
      unregister();
    });
    return ref;
  }
}
