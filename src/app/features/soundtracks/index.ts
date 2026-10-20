import type { SoundtrackEditor } from './presentation/components/soundtrack-editor/soundtrack-editor';
export { provideSoundtracks } from './soundtracks.providers';
export { SoundtrackEditorMode } from './application/workflows/soundtrack-editor.mode';
export { SoundtrackOwnerType } from './domain/ownership/soundtrack-owner';
export type { SoundtrackOwner } from './domain/ownership/soundtrack-owner';
export async function loadSoundtrackEditor(): Promise<typeof SoundtrackEditor> {
  const { SoundtrackEditor } =
    await import('./presentation/components/soundtrack-editor/soundtrack-editor');
  return SoundtrackEditor;
}
