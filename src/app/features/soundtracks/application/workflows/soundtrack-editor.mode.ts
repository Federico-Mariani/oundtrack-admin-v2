export const SoundtrackEditorMode = {
  Soundtrack: 'soundtrack',
  Version: 'version',
  Upload: 'upload',
  Languages: 'languages',
} as const;

export type SoundtrackEditorMode = (typeof SoundtrackEditorMode)[keyof typeof SoundtrackEditorMode];
