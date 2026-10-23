import { DestroyRef, inject, type Type, ViewContainerRef } from '@angular/core';
import type { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { ModalService } from '@shared/ui/modal/modal.service';
import type { ModalContent } from '@shared/ui/modal/modal-content';
export class CatalogDetailNavigation {
  private readonly modals = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private ref?: BrnDialogRef<void>;
  private id: string | null = null;
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.id = null;
      this.ref = undefined;
    });
  }
  synchronize(
    id: string | null,
    component: Type<ModalContent<{ id: string }, void>>,
    closed: (id: string) => void,
  ): void {
    if (id === this.id) return;
    const previous = this.ref;
    this.ref = undefined;
    this.id = id;
    previous?.forceClose();
    if (!id || this.destroyRef.destroyed) return;
    const ref = this.modals.open(
      component,
      { id },
      {
        viewContainerRef: this.viewContainerRef,
        contentClass:
          'w-[64rem] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] p-0 overflow-hidden',
      },
    );
    this.ref = ref;
    ref.closed$.subscribe(() => {
      if (this.ref !== ref || this.destroyRef.destroyed) return;
      this.ref = undefined;
      this.id = null;
      closed(id);
    });
  }
}
