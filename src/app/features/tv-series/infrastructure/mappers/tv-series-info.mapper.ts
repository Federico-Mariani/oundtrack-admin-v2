import type { TvSeriesInfoResponseDto } from '../api/tv-series-info-response.dto';
import type { TvSeriesInfoModel } from '../../domain/models/tv-series-info.model';

export function toTvSeriesInfo(dto: TvSeriesInfoResponseDto): TvSeriesInfoModel {
  return {
    id: dto.id,
    title: dto.title,
    releaseDate: dto.releaseDate,
    posterUrl: dto.posterUrl,
    backdropUrl: dto.backdropUrl,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
