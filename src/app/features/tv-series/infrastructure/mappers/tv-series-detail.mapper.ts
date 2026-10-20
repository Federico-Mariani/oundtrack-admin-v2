import { toTvSeries } from './tv-series.mapper';
import type { TvSeriesDetailResponseDto } from '../api/tv-series-detail-response.dto';
import type { TvSeriesDetailModel } from '../../domain/models/tv-series-detail.model';
import { toSoundtrack } from '@app/core/catalog/mappers/soundtrack.mapper';
import { toGameCategory } from '@app/core/catalog/mappers/game-category.mapper';

export function toTvSeriesDetail(dto: TvSeriesDetailResponseDto): TvSeriesDetailModel {
  return {
    ...toTvSeries(dto),
    gameCategories: dto.gameCategories.map((category) => toGameCategory(category)),
    soundtracks: dto.soundtracks.map((soundtrack) => toSoundtrack(soundtrack)),
  };
}
