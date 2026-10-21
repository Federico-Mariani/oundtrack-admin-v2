import { toApiLocale } from '@app/core/http/api-locale.mapper';
import type { CreateTvSeriesCommand } from '../../application/commands/create-tv-series.command';
import type { CreateTvSeriesRequestDto } from '../api/create-tv-series-request.dto';

export function toCreateTvSeriesRequest(tvSeries: CreateTvSeriesCommand): CreateTvSeriesRequestDto {
  return {
    title: tvSeries.title.trim(),
    year: tvSeries.year,
    language: toApiLocale(tvSeries.language),
  };
}
