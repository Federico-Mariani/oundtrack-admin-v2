import type { DialogRef } from '@angular/cdk/dialog';

/** Contract linking a dedicated modal component to its parameters and close result. */
export interface ModalContent<TParams, TResult> {
  readonly params: TParams;
  readonly ref: DialogRef<TResult>;
}
