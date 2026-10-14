import { movieDetailResponse } from '../../testing/movie-detail.fixture';
import { toMovieDetail } from './movie-detail.mapper';
describe('Movie detail mapping', () => {
  it('maps localized fields without altering image and signed audio URLs', () => {
    const dto = movieDetailResponse();
    const result = toMovieDetail(dto);
    expect(result.info['it-IT']?.posterUrl).toBe(dto.info[0]?.posterUrl);
    expect(result.info['it-IT']?.backdropUrl).toBe(dto.info[0]?.backdropUrl);
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
});
