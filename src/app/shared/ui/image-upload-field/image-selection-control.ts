import type { Signal, WritableSignal } from '@angular/core';
export interface ImageSelectionControl {
  readonly fileKey: Signal<string | null>;
  readonly name: Signal<string>;
  readonly size: Signal<string>;
  readonly preview: Signal<string | null>;
  readonly checking: Signal<boolean>;
  readonly invalid: Signal<boolean>;
  readonly multiple: WritableSignal<boolean>;
  choose(file: File): Promise<void>;
  remove(): void;
}
