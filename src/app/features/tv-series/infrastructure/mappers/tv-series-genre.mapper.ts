import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import type { TvSeriesGenreModel } from '../../domain/models/tv-series-genre.model';
import type { TvSeriesGenreResponseDto } from '../api/tv-series-genre-response.dto';
import { toTvSeriesGenreInfo } from './tv-series-genre-info.mapper';

export function toTvSeriesGenre(dto: TvSeriesGenreResponseDto): TvSeriesGenreModel {
  return {
    id: dto.id,
    info: mapApiLocalized(dto.info, toTvSeriesGenreInfo),
  };
}
