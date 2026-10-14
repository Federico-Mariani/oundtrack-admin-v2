import type { BrnDialogRef } from '@spartan-ng/brain/dialog';

/** Contract linking a dedicated modal component to its parameters and close result. */
export interface ModalContent<TParams, TResult> {
  readonly params: TParams;
  readonly ref: BrnDialogRef<TResult>;
}
