import { toApiLocale } from '@app/core/http/api-locale.mapper';
import type { CreateTvSeriesModel } from '../../domain/models/create-tv-series.model';
import type { CreateTvSeriesRequestDto } from '../api/create-tv-series-request.dto';

export function toCreateTvSeriesRequest(tvSeries: CreateTvSeriesModel): CreateTvSeriesRequestDto {
  return {
    title: tvSeries.title.trim(),
    year: tvSeries.year,
    language: toApiLocale(tvSeries.language),
  };
}
