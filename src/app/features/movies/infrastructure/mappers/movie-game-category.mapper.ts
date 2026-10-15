import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import type { MovieGameCategoryResponseDto } from '../api/movie-game-category-response.dto';
import type { MovieGameCategoryModel } from '../../domain/models/movie-game-category.model';
import { toMovieGameCategoryInfo } from './movie-game-category-info.mapper';

export function toMovieGameCategory(dto: MovieGameCategoryResponseDto): MovieGameCategoryModel {
  return {
    id: dto.id,
    image: dto.image,
    info: mapApiLocalized(dto.info, toMovieGameCategoryInfo),
  };
}
