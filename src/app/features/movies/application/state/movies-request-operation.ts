export const MoviesRequestOperation = {
  AudioSave: 'Save Audio',
  AudioEditor: 'Audio Editor',
} as const;
export type MoviesRequestOperation =
  (typeof MoviesRequestOperation)[keyof typeof MoviesRequestOperation];
