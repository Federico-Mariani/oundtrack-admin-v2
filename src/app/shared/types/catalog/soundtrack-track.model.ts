import type { Id } from '@shared/types/id';
import type { SupportedLocale } from '@shared/localization/supported-locale';

export interface SoundtrackTrackModel {
  readonly id: Id;
  readonly externalId: string;
  readonly path: string | null;
  readonly name: string;
  readonly artist: string;
  readonly languages: Array<SupportedLocale>;
}
