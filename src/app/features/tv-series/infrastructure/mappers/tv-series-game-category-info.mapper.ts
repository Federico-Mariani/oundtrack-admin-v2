import type { TvSeriesGameCategoryInfoModel } from '../../domain/models/tv-series-game-category-info.model';
import type { TvSeriesGameCategoryInfoResponseDto } from '../api/tv-series-game-category-info-response.dto';

export function toTvSeriesGameCategoryInfo(
  dto: TvSeriesGameCategoryInfoResponseDto,
): TvSeriesGameCategoryInfoModel {
  return {
    id: dto.id,
    name: dto.name,
  };
}
