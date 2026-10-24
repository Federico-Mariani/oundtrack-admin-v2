import type { GameCategoryModel } from '../../../domain/models/game-category.model';
export const CategorySaveEventKind = {
  Prepared: 'prepared',
  Progress: 'progress',
  Uploaded: 'uploaded',
  Completed: 'completed',
} as const;
export type CategorySaveEvent =
  | { readonly kind: typeof CategorySaveEventKind.Prepared; readonly category: GameCategoryModel }
  | { readonly kind: typeof CategorySaveEventKind.Progress; readonly progress: number }
  | {
      readonly kind: typeof CategorySaveEventKind.Uploaded;
      readonly fileKey: string;
      readonly key: string;
    }
  | { readonly kind: typeof CategorySaveEventKind.Completed; readonly category: GameCategoryModel };
