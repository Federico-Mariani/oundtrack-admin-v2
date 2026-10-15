import type { MovieGameCategoryInfoResponseDto } from '../api/movie-game-category-info-response.dto';
import type { MovieGameCategoryInfoModel } from '../../domain/models/movie-game-category-info.model';

export function toMovieGameCategoryInfo(
  dto: MovieGameCategoryInfoResponseDto,
): MovieGameCategoryInfoModel {
  return {
    id: dto.id,
    name: dto.name,
  };
}
