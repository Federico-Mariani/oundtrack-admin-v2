import type { Id } from '@shared/types/id';
import type { MovieSoundtrackTrackModel } from './movie-soundtrack-track.model';

export interface MovieSoundtrackModel {
  readonly id: Id;
  readonly tracks: ReadonlyArray<MovieSoundtrackTrackModel>;
}
