export const MovieAudioPhase = {
  Ready: 'ready',
  Creating: 'creating',
  Uploading: 'uploading',
  Confirming: 'confirming',
  Languages: 'languages',
  Done: 'done',
} as const;
export type MovieAudioPhase = (typeof MovieAudioPhase)[keyof typeof MovieAudioPhase];
