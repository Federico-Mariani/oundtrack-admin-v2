import { DestroyRef, inject, type Type, ViewContainerRef } from '@angular/core';
import { ModalService } from '@shared/ui/modal/modal.service';
import type { ModalContent } from '@shared/ui/modal/modal-content';
export class CatalogCreationDialog {
  private readonly modals = inject(ModalService);
  private readonly container = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private opened = false;
  open(component: Type<ModalContent<undefined, boolean>>, created: () => void): void {
    if (this.opened || this.destroyRef.destroyed) return;
    this.opened = true;
    this.modals
      .open(component, undefined, {
        viewContainerRef: this.container,
        disableClose: true,
        contentClass: 'w-[min(36rem,calc(100vw-2rem))] max-w-none p-6 sm:p-8',
      })
      .closed$.subscribe((changed) => {
        this.opened = false;
        if (changed && !this.destroyRef.destroyed) created();
      });
  }
}
