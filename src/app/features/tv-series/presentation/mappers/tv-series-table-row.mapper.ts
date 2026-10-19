import { resolveLocalized } from '@shared/localization/localized.queries';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@shared/localization/supported-locale';
import type { TvSeriesModel } from '../../domain/models/tv-series.model';
import type { TvSeriesTableRowModel } from '../models/tv-series-table-row.model';

export function toTvSeriesTableRow(
  tvSeries: TvSeriesModel,
  locale: SupportedLocale,
  dateFormatter: Intl.DateTimeFormat,
): TvSeriesTableRowModel {
  const info = resolveLocalized(tvSeries.info, locale);
  const genres = tvSeries.genres.flatMap((genre) => {
    const genreInfo = resolveLocalized(genre.info, locale);
    return genreInfo ? [genreInfo.name] : [];
  });
  const timestamp = info ? new Date(info.releaseDate).getTime() : NaN;
  const releaseDate = Number.isFinite(timestamp) ? timestamp : undefined;

  return {
    id: tvSeries.id,
    externalTvSeriesId: tvSeries.externalTvSeriesId,
    title: info?.title ?? '—',
    genres,
    languages: SUPPORTED_LOCALES.filter((language) => tvSeries.info[language]),
    releaseDate,
    releaseDateLabel: releaseDate === undefined ? '—' : dateFormatter.format(releaseDate),
    posterUrl: info?.posterUrl ?? null,
  };
}
