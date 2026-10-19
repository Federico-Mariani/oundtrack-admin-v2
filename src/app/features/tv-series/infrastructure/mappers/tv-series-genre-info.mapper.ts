import type { TvSeriesGenreInfoResponseDto } from '../api/tv-series-genre-info-response.dto';
import type { TvSeriesGenreInfoModel } from '../../domain/models/tv-series-genre-info.model';

export function toTvSeriesGenreInfo(dto: TvSeriesGenreInfoResponseDto): TvSeriesGenreInfoModel {
  return {
    id: dto.id,
    name: dto.name,
  };
}
