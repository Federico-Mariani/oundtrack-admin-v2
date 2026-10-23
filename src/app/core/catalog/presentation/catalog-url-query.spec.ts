import { convertToParamMap } from '@angular/router';
import {
  readCatalogQuery,
  writeCatalogQuery,
  readCatalogDetailId,
  CatalogSort,
  CatalogSortOrder,
} from './catalog-url-query';
describe('Catalog URL state', () => {
  it.each(['externalMovieId', 'externalTvSeriesId'] as const)(
    'round-trips filters, pagination and sorting for %s',
    (external) => {
      const params = convertToParamMap({
        page: '3',
        limit: '50',
        search: 'Alien & Dune',
        releaseYearFrom: '1979',
        releaseYearTo: '2026',
        [external]: '42',
        sortBy: external,
        sortOrder: CatalogSortOrder.Ascending,
        detail: 'movie-1',
      });
      const query = readCatalogQuery(params, external);
      expect(query).toEqual({
        page: 3,
        limit: 50,
        search: 'Alien & Dune',
        filters: { releaseYearFrom: 1979, releaseYearTo: 2026, [external]: 42 },
        sortBy: external,
        sortOrder: CatalogSortOrder.Ascending,
      });
      expect(
        readCatalogQuery(convertToParamMap(writeCatalogQuery(query, external)), external),
      ).toEqual(query);
      expect(writeCatalogQuery(query, external)).not.toHaveProperty('detail');
    },
  );
  it('rejects malformed values and uses stable defaults', () => {
    const query = readCatalogQuery(
      convertToParamMap({
        page: '-1',
        limit: '100000',
        externalMovieId: 'NaN',
        releaseYearFrom: '2025',
        releaseYearTo: '1990',
        sortBy: 'invalid',
        sortOrder: 'wrong',
      }),
      'externalMovieId',
    );
    expect(query.page).toBe(1);
    expect(query.limit).toBe(20);
    expect(query.filters).toEqual({
      externalMovieId: undefined,
      releaseYearFrom: 2025,
      releaseYearTo: undefined,
    });
    expect(query.sortBy).toBe(CatalogSort.CreatedAt);
    expect(query.sortOrder).toBe(CatalogSortOrder.Descending);
  });
  it('removes default values without clearing unrelated query parameters', () => {
    const encoded = writeCatalogQuery(
      readCatalogQuery(convertToParamMap({}), 'externalMovieId'),
      'externalMovieId',
    );
    expect(Object.values(encoded).every((value) => value === null)).toBe(true);
    expect(encoded).not.toHaveProperty('detail');
  });
  it('accepts entity identifiers and ignores invalid detail links', () => {
    expect(
      readCatalogDetailId(convertToParamMap({ detail: 'd79af3f8-da40-4974-ae94-4217fbc95150' })),
    ).toBe('d79af3f8-da40-4974-ae94-4217fbc95150');
    expect(readCatalogDetailId(convertToParamMap({ detail: '../../movie' }))).toBeNull();
    expect(readCatalogDetailId(convertToParamMap({}))).toBeNull();
  });
});
