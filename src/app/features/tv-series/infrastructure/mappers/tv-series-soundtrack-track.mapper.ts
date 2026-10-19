import { fromApiLocales } from '../../../../core/http/api-locale.mapper';
import type { TvSeriesSoundtrackTrackResponseDto } from '../api/tv-series-soundtrack-track-response.dto';
import type { TvSeriesSoundtrackTrackModel } from '../../domain/models/tv-series-soundtrack-track.model';

export function toTvSeriesSoundtrackTrack(
  dto: TvSeriesSoundtrackTrackResponseDto,
): TvSeriesSoundtrackTrackModel {
  return {
    id: dto.id,
    externalId: dto.externalId,
    path: dto.path,
    name: dto.name,
    artist: dto.artist,
    languages: fromApiLocales(dto.languages),
  };
}
