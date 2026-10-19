export const MovieAudioMode = {
  Soundtrack: 'soundtrack',
  Version: 'version',
  Upload: 'upload',
  Languages: 'languages',
} as const;
export type MovieAudioMode = (typeof MovieAudioMode)[keyof typeof MovieAudioMode];
