import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import { fromApiLocale } from '@app/core/http/api-locale.mapper';
import type { MovieDetailModel } from '../../domain/models/movie-detail.model';
import type { MovieDetailResponseDto } from '../api/movie-detail-response.dto';
import { toMovie } from './movie.mapper';
import { toMovieInfo } from './movie-info.mapper';
import { toMovieImageUrl } from './movie-image-url.mapper';
export function toMovieDetail(dto: MovieDetailResponseDto): MovieDetailModel {
  return {
    ...toMovie(dto),
    info: mapApiLocalized(dto.info, (info) => ({
      ...toMovieInfo(info),
      posterUrl: toMovieImageUrl(info.posterUrl),
      backdropUrl: toMovieImageUrl(info.backdropUrl),
    })),
    gameCategories: dto.gameCategories.map((category) => ({
      id: category.id,
      image: toMovieImageUrl(category.image) || null,
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
