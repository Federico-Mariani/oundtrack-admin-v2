import { resolveLocalized } from '@shared/localization/localized.queries';

import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { MovieModel } from '../../domain/models/movie.model';
import type { MovieTableRowModel } from '../models/movie-table-row.model';

export function toMovieTableRow(movie: MovieModel, locale: SupportedLocale): MovieTableRowModel {
  const info = resolveLocalized(movie.info, locale);

  const genres = movie.genres.flatMap((genre) => {
    const genreInfo = resolveLocalized(genre.info, locale);

    return genreInfo ? [genreInfo.name] : [];
  });

  return {
    id: movie.id,
    externalMovieId: movie.externalMovieId,

    title: info?.title ?? '—',

    genres: genres.join(', '),

    releaseDate: info ? new Intl.DateTimeFormat(locale).format(new Date(info.releaseDate)) : '—',

    posterUrl: info?.posterUrl ?? null,
  };
}
