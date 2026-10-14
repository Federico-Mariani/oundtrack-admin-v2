import type { MovieModel } from '../../domain/models/movie.model';
import { toMovieTableRow } from './movie-table-row.mapper';

function movie(releaseDate = Date.UTC(2020, 1, 15)): MovieModel {
  return {
    id: 'movie-1',
    externalMovieId: 42,
    createdAt: 0,
    updatedAt: 0,
    genres: [{ id: 'genre-1', info: { 'en-US': { id: 'genre-info-1', name: 'Drama' } } }],
    info: {
      'en-US': {
        id: 'info-1',
        title: 'Example',
        releaseDate,
        posterUrl: 'poster.jpg',
        backdropUrl: '',
        createdAt: 0,
        updatedAt: 0,
      },
    },
  };
}

describe('toMovieTableRow', () => {
  it('keeps a numeric date for sorting and a localized label for display', () => {
    const formatter = new Intl.DateTimeFormat('it-IT');
    const row = toMovieTableRow(movie(), 'it-IT', formatter);
    expect(row.releaseDate).toBe(Date.UTC(2020, 1, 15));
    expect(row.releaseDateLabel).toBe(formatter.format(Date.UTC(2020, 1, 15)));
    expect(row.title).toBe('Example');
    expect(row.genres).toEqual(['Drama']);
  });

  it('handles invalid dates without preventing the table from rendering', () => {
    const row = toMovieTableRow(movie(NaN), 'en-US', new Intl.DateTimeFormat('en-US'));
    expect(row.releaseDate).toBeUndefined();
    expect(row.releaseDateLabel).toBe('—');
  });

  it('handles missing localized information', () => {
    const row = toMovieTableRow(
      { ...movie(), info: {} },
      'en-US',
      new Intl.DateTimeFormat('en-US'),
    );
    expect(row.title).toBe('—');
    expect(row.posterUrl).toBeNull();
    expect(row.releaseDate).toBeUndefined();
  });
});
