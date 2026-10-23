import type { Type } from '@angular/core';
import type { OwnerCategoriesModal } from './owner-categories-modal';
export async function loadOwnerCategoriesModal(): Promise<Type<OwnerCategoriesModal>> {
  return (await import('./owner-categories-modal')).OwnerCategoriesModal;
}
