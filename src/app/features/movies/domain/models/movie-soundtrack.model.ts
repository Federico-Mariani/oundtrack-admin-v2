import type { Id } from '@shared/types/id';
import type { MovieTrackModel } from './movie-track.model';
export interface MovieSoundtrackModel {
  readonly id: Id;
  readonly tracks: readonly MovieTrackModel[];
}
