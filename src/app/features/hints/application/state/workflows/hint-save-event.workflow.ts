import type { HintModel } from '../../../domain/models/hint.model';
export const HintSaveEventKind = {
  Prepared: 'prepared',
  Localized: 'localized',
  Progress: 'progress',
  Uploaded: 'uploaded',
  Completed: 'completed',
} as const;
export type HintSaveEvent =
  | {
      readonly kind: typeof HintSaveEventKind.Prepared | typeof HintSaveEventKind.Localized;
      readonly hint: HintModel;
    }
  | { readonly kind: typeof HintSaveEventKind.Progress; readonly progress: number }
  | { readonly kind: typeof HintSaveEventKind.Uploaded; readonly fileKey: string }
  | { readonly kind: typeof HintSaveEventKind.Completed; readonly hint: HintModel | null };
