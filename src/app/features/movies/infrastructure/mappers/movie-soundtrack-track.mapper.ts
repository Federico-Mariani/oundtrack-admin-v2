import { fromApiLocale } from '../../../../core/http/api-locale.mapper';
import type { MovieSoundtrackTrackResponseDto } from '../api/movie-soundtrack-track-response.dto';
import type { MovieSoundtrackTrackModel } from '../../domain/models/movie-soundtrack-track.model';

export function toMovieSoundtrackTrack(
  dto: MovieSoundtrackTrackResponseDto,
): MovieSoundtrackTrackModel {
  return {
    id: dto.id,
    externalId: dto.externalId,
    path: dto.path,
    name: dto.name,
    artist: dto.artist,
    language: fromApiLocale(dto.language),
  };
}
