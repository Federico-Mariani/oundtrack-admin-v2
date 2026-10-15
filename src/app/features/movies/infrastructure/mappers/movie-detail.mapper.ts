import type { MovieDetailModel } from '../../domain/models/movie-detail.model';
import type { MovieDetailResponseDto } from '../api/movie-detail-response.dto';
import { toMovie } from './movie.mapper';
import { toMovieGameCategory } from './movie-game-category.mapper';
import { toMovieSoundtrack } from './movie-soundtrack.mapper';

export function toMovieDetail(dto: MovieDetailResponseDto): MovieDetailModel {
  return {
    ...toMovie(dto),
    gameCategories: dto.gameCategories.map((category) => toMovieGameCategory(category)),
    soundtracks: dto.soundtracks.map((soundtrack) => toMovieSoundtrack(soundtrack)),
  };
}
