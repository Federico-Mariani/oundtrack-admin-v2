export const TvSeriesAudioMode = {
  Soundtrack: 'soundtrack',
  Version: 'version',
  Upload: 'upload',
  Languages: 'languages',
} as const;

export type TvSeriesAudioMode = (typeof TvSeriesAudioMode)[keyof typeof TvSeriesAudioMode];
