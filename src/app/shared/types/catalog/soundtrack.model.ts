import type { Id } from '@shared/types/id';
import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';

export interface SoundtrackModel {
  readonly id: Id;
  readonly tracks: ReadonlyArray<SoundtrackTrackModel>;
}
