import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import type { TvSeriesModel } from '../../domain/models/tv-series.model';
import type { TvSeriesResponseDto } from '../api/tv-series-response.dto';
import { toTvSeriesInfo } from './tv-series-info.mapper';
import { toGenre } from '@app/core/catalog/mappers/genre.mapper';

export function toTvSeries(dto: TvSeriesResponseDto): TvSeriesModel {
  return {
    id: dto.id,
    externalTvSeriesId: dto.externalTvSeriesId,
    genres: dto.genres.map(toGenre),
    info: mapApiLocalized(dto.info, toTvSeriesInfo),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
