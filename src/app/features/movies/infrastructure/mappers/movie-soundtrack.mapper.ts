import type { MovieSoundtrackResponseDto } from '../api/movie-soundtrack-response.dto';
import type { MovieSoundtrackModel } from '../../domain/models/movie-soundtrack.model';
import { toMovieSoundtrackTrack } from './movie-soundtrack-track.mapper';

export function toMovieSoundtrack(dto: MovieSoundtrackResponseDto): MovieSoundtrackModel {
  return {
    id: dto.id,
    tracks: dto.tracks.map((track) => toMovieSoundtrackTrack(track)),
  };
}
