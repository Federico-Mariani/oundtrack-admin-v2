import type { Id } from '@shared/types/id';
import type { TvSeriesSoundtrackTrackModel } from './tv-series-soundtrack-track.model';

export interface TvSeriesSoundtrackModel {
  readonly id: Id;
  readonly tracks: ReadonlyArray<TvSeriesSoundtrackTrackModel>;
}
