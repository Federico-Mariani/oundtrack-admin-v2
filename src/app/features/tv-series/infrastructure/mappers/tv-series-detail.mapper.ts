import { toTvSeries } from './tv-series.mapper';
import type { TvSeriesDetailResponseDto } from '../api/tv-series-detail-response.dto';
import type { TvSeriesDetailModel } from '../../domain/models/tv-series-detail.model';
import { toTvSeriesSoundtrack } from './tv-series-soundtrack.mapper';
import { toTvSeriesGameCategory } from './tv-series-game-category.mapper';

export function toTvSeriesDetail(dto: TvSeriesDetailResponseDto): TvSeriesDetailModel {
  return {
    ...toTvSeries(dto),
    gameCategories: dto.gameCategories.map((category) => toTvSeriesGameCategory(category)),
    soundtracks: dto.soundtracks.map((soundtrack) => toTvSeriesSoundtrack(soundtrack)),
  };
}
