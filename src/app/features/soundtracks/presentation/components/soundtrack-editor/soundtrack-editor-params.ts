import type { SoundtrackOwner } from '../../../domain/ownership/soundtrack-owner';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { SoundtrackEditorMode } from '../../../application/workflows/soundtrack-editor.mode';
import type { SoundtrackModel } from '@shared/types/catalog/soundtrack.model';
import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';

export interface SoundtrackEditorParams {
  readonly mode: SoundtrackEditorMode;
  readonly owner: SoundtrackOwner;
  readonly locale: SupportedLocale;
  readonly soundtrack?: SoundtrackModel;
  readonly track?: SoundtrackTrackModel;
}
