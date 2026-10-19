import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import type { TvSeriesGameCategoryResponseDto } from '../api/tv-series-game-category-response.dto';
import type { TvSeriesGameCategoryModel } from '../../domain/models/tv-series-game-category.model';
import { toTvSeriesGameCategoryInfo } from './tv-series-game-category-info.mapper';

export function toTvSeriesGameCategory(
  dto: TvSeriesGameCategoryResponseDto,
): TvSeriesGameCategoryModel {
  return {
    id: dto.id,
    image: dto.image,
    info: mapApiLocalized(dto.info, toTvSeriesGameCategoryInfo),
  };
}
