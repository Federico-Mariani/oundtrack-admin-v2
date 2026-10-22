export const HintSavePhase = {
  Idle: 'idle',
  Preparing: 'preparing',
  Localizing: 'localizing',
  Uploading: 'uploading',
  Confirming: 'confirming',
  Done: 'done',
} as const;
export type HintSavePhase = (typeof HintSavePhase)[keyof typeof HintSavePhase];
