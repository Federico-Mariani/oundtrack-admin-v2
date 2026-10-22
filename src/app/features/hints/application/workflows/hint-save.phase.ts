export const HintSavePhase = {
  Idle: 'idle',
  Preparing: 'preparing',
  Uploading: 'uploading',
  Confirming: 'confirming',
  Done: 'done',
} as const;
export type HintSavePhase = (typeof HintSavePhase)[keyof typeof HintSavePhase];
