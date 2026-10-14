import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import type { PageResult } from '@shared/types/pagination/page-result';
import type { MovieModel } from '../../domain/models/movie.model';
import { HttpMoviesRepository } from './http-movies.repository';
import { DEFAULT_MOVIES_LIST_QUERY } from '../../domain/models/movies-list-query.model';

describe('Movies paginated HTTP contract', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpMoviesRepository],
    }),
  );
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });
  it('serializes pagination and optional filters and maps metadata and API locales', () => {
    const next = vi.fn<(result: PageResult<MovieModel>) => void>();
    TestBed.inject(HttpMoviesRepository)
      .getAll({
        ...DEFAULT_MOVIES_LIST_QUERY,
        page: 3,
        search: '  Matrix  ',
        filters: {
          releaseYearFrom: 1990,
          releaseYearTo: 2005,
          externalMovieId: 42,
        },
      })
      .subscribe(next);
    const request = TestBed.inject(HttpTestingController).expectOne((req) =>
      req.url.endsWith('/movies'),
    );
    expect(request.request.params.get('page')).toBe('3');
    expect(request.request.params.get('limit')).toBe('20');
    expect(request.request.params.get('search')).toBe('Matrix');
    expect(request.request.params.has('infoLanguage')).toBe(false);
    expect(request.request.params.get('releaseYearFrom')).toBe('1990');
    expect(request.request.params.get('releaseYearTo')).toBe('2005');
    expect(request.request.params.get('externalMovieId')).toBe('42');
    expect(request.request.params.get('sortBy')).toBe('createdAt');
    expect(request.request.params.get('sortOrder')).toBe('desc');
    request.flush({
      data: [
        {
          id: 'one',
          externalMovieId: 42,
          genres: [],
          createdAt: 0,
          updatedAt: 0,
          info: [
            {
              id: 'info',
              language: 'en-EN',
              title: 'Matrix',
              releaseDate: 0,
              posterUrl: '',
              backdropUrl: '',
              createdAt: 0,
              updatedAt: 0,
            },
          ],
        },
      ],
      meta: {
        page: 3,
        limit: 20,
        total: 41,
        totalPages: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });
    const result = next.mock.calls[0]?.[0];
    expect(result.page).toBe(3);
    expect(result.limit).toBe(20);
    expect(result.total).toBe(41);
    expect(result.items[0]?.info['en-US']?.title).toBe('Matrix');
  });
  it('omits empty filters and maps HTTP errors', () => {
    const error = vi.fn();
    TestBed.inject(HttpMoviesRepository).getAll(DEFAULT_MOVIES_LIST_QUERY).subscribe({ error });
    const request = TestBed.inject(HttpTestingController).expectOne((req) =>
      req.url.endsWith('/movies'),
    );
    expect(request.request.params.has('search')).toBe(false);
    expect(request.request.params.has('infoLanguage')).toBe(false);
    request.flush(
      { message: 'Invalid range' },
      { status: 422, statusText: 'Unprocessable Entity' },
    );
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ code: 'validation' }));
  });
});
