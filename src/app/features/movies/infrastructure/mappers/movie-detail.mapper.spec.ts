import { movieDetailResponse } from '../../testing/movie-detail.fixture';
import { toMovieDetail } from './movie-detail.mapper';
import { toMovieImageUrl } from './movie-image-url.mapper';
describe('Movie detail mapping', () => {
  it('normalizes localized fields and duplicated image prefixes without altering signed audio URLs', () => {
    const dto = movieDetailResponse();
    const result = toMovieDetail(dto);
    expect(result.info['it-IT']?.posterUrl).toBe('https://www.themoviedb.org/t/p/w500/poster.jpg');
    expect(result.info['it-IT']?.backdropUrl).toBe(
      'https://www.themoviedb.org/t/p/w500/backdrop.jpg',
    );
    expect(result.info['en-US']?.title).toBe('Interstellar English');
    expect(result.gameCategories[0]?.info['en-US']?.name).toBe('Movies');
    expect(result.soundtracks[0]?.tracks[0]?.path).toBe(dto.soundtracks[0]?.tracks[0]?.path);
    expect(result.soundtracks[0]?.tracks[0]?.language).toBe('en-US');
  });
  it('preserves empty collections and missing images', () => {
    const result = toMovieDetail({
      ...movieDetailResponse(),
      genres: [],
      info: [],
      gameCategories: [],
      soundtracks: [],
    });
    expect(result.info).toEqual({});
    expect(result.gameCategories).toEqual([]);
    expect(result.soundtracks).toEqual([]);
  });
  it('rejects invalid or non-web images and preserves valid URLs', () => {
    for (const value of [null, undefined, '', 'broken', 'javascript:alert(1)']) {
      expect(toMovieImageUrl(value)).toBe('');
    }
    expect(toMovieImageUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg');
  });
});
