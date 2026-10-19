import type { TvSeriesSoundtrackResponseDto } from '../api/tv-series-soundtrack-response.dto';
import type { TvSeriesSoundtrackModel } from '../../domain/models/tv-series-soundtrack.model';
import { toTvSeriesSoundtrackTrack } from './tv-series-soundtrack-track.mapper';

export function toTvSeriesSoundtrack(dto: TvSeriesSoundtrackResponseDto): TvSeriesSoundtrackModel {
  return {
    id: dto.id,
    tracks: dto.tracks.map((track) => toTvSeriesSoundtrackTrack(track)),
  };
}
