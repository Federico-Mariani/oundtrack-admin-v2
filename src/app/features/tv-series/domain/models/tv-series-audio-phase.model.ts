export const TvSeriesAudioPhase = {
  Ready: 'ready',
  Creating: 'creating',
  Uploading: 'uploading',
  Confirming: 'confirming',
  Languages: 'languages',
  Done: 'done',
} as const;

export type TvSeriesAudioPhase = (typeof TvSeriesAudioPhase)[keyof typeof TvSeriesAudioPhase];
