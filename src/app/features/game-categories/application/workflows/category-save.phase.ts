export const CategorySavePhase = {
  Idle: 'idle',
  Names: 'names',
  Upload: 'upload',
  Confirm: 'confirm',
} as const;
export type CategorySavePhase = (typeof CategorySavePhase)[keyof typeof CategorySavePhase];
