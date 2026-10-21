import type { SoundtrackOwner } from '../../domain/ownership/soundtrack-owner';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { SoundtrackEditorMode } from '../workflows/soundtrack-editor.mode';

export interface SaveSoundtrackCommand {
  readonly mode: SoundtrackEditorMode;
  readonly owner: SoundtrackOwner;
  readonly soundtrackId: string | null;
  readonly externalId: string;
  readonly languages: Array<SupportedLocale>;
  readonly fileKey: string | null;
}
