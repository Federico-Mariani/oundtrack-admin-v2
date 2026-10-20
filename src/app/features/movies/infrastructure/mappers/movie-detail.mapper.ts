import type { MovieDetailModel } from '../../domain/models/movie-detail.model';
import type { MovieDetailResponseDto } from '../api/movie-detail-response.dto';
import { toMovie } from './movie.mapper';
import { toGameCategory } from '@app/core/catalog/mappers/game-category.mapper';
import { toSoundtrack } from '@app/core/catalog/mappers/soundtrack.mapper';

export function toMovieDetail(dto: MovieDetailResponseDto): MovieDetailModel {
  return {
    ...toMovie(dto),
    gameCategories: dto.gameCategories.map((category) => toGameCategory(category)),
    soundtracks: dto.soundtracks.map((soundtrack) => toSoundtrack(soundtrack)),
  };
}
