import { resolveLocalized } from '@shared/localization/localized.queries';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@shared/localization/supported-locale';
import type { MovieModel } from '../../domain/models/movie.model';
import type { MovieTableRowModel } from '../models/movie-table-row.model';

export function toMovieTableRow(
  movie: MovieModel,
  locale: SupportedLocale,
  dateFormatter: Intl.DateTimeFormat,
): MovieTableRowModel {
  const info = resolveLocalized(movie.info, locale);
  const genres = movie.genres.flatMap((genre) => {
    const genreInfo = resolveLocalized(genre.info, locale);
    return genreInfo ? [genreInfo.name] : [];
  });
  const timestamp = info ? new Date(info.releaseDate).getTime() : NaN;
  const releaseDate = Number.isFinite(timestamp) ? timestamp : undefined;

  return {
    id: movie.id,
    externalMovieId: movie.externalMovieId,
    title: info?.title ?? '—',
    genres,
    languages: SUPPORTED_LOCALES.filter((language) => movie.info[language]),
    releaseDate,
    releaseDateLabel: releaseDate === undefined ? '—' : dateFormatter.format(releaseDate),
    posterUrl: info?.posterUrl ?? null,
  };
}
