export const SoundtrackEditorPhase = {
  Ready: 'ready',
  Creating: 'creating',
  Uploading: 'uploading',
  Confirming: 'confirming',
  Languages: 'languages',
  Done: 'done',
} as const;

export type SoundtrackEditorPhase =
  (typeof SoundtrackEditorPhase)[keyof typeof SoundtrackEditorPhase];
