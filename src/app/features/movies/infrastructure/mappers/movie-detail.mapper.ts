import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import { fromApiLocale } from '@app/core/http/api-locale.mapper';
import type { MovieDetailModel } from '../../domain/models/movie-detail.model';
import type { MovieDetailResponseDto } from '../api/movie-detail-response.dto';
import { toMovie } from './movie.mapper';
export function toMovieDetail(dto: MovieDetailResponseDto): MovieDetailModel {
  return {
    ...toMovie(dto),
    gameCategories: dto.gameCategories.map((category) => ({
      id: category.id,
      image: category.image,
      info: mapApiLocalized(category.info, (info) => ({ id: info.id, name: info.name })),
    })),
    soundtracks: dto.soundtracks.map((soundtrack) => ({
      id: soundtrack.id,
      tracks: soundtrack.tracks.map((track) => ({
        ...track,
        language: fromApiLocale(track.language),
      })),
    })),
  };
}
