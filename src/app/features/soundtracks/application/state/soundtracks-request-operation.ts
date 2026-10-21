export const SoundtracksRequestOperation = {
  AudioSave: 'Save Audio',
  AudioEditor: 'Audio Editor',
} as const;
export type SoundtracksRequestOperation =
  (typeof SoundtracksRequestOperation)[keyof typeof SoundtracksRequestOperation];
