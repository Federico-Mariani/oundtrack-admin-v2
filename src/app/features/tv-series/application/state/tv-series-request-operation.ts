export const TvSeriesRequestOperation = {
  AudioSave: 'Save Audio',
  AudioEditor: 'Audio Editor',
} as const;
export type TvSeriesRequestOperation =
  (typeof TvSeriesRequestOperation)[keyof typeof TvSeriesRequestOperation];
