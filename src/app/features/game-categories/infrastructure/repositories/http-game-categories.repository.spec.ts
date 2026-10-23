import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { HttpGameCategoriesRepository } from './http-game-categories.repository';
import { GameCategoryOwnerType } from '../../domain/values/game-category-owner';
import { RequestErrorCode } from '@shared/state/request/request-error';
describe('Owner category HTTP contract', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpGameCategoriesRepository],
    }),
  );
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });
  it.each([GameCategoryOwnerType.Movie, GameCategoryOwnerType.TvSeries])(
    'sends the complete selection for %s and accepts an empty response',
    (type) => {
      const success = vi.fn();
      TestBed.inject(HttpGameCategoriesRepository)
        .setForOwner({ owner: { id: 'owner', type }, categoryIds: ['one', 'two'] })
        .subscribe(success);
      const request = TestBed.inject(HttpTestingController).expectOne(
        environment.apiUrl + '/game-categories/set-for-owner',
      );
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({
        ownerId: 'owner',
        ownerType: type,
        gameCategoryIds: ['one', 'two'],
      });
      request.flush(null);
      expect(success).toHaveBeenCalledWith(undefined);
    },
  );
  it('allows removing all categories and maps failed saves', () => {
    const error = vi.fn();
    TestBed.inject(HttpGameCategoriesRepository)
      .setForOwner({ owner: { id: 'owner', type: GameCategoryOwnerType.Movie }, categoryIds: [] })
      .subscribe({ error });
    const request = TestBed.inject(HttpTestingController).expectOne(
      environment.apiUrl + '/game-categories/set-for-owner',
    );
    expect(request.request.body).toEqual({
      ownerId: 'owner',
      ownerType: GameCategoryOwnerType.Movie,
      gameCategoryIds: [],
    });
    request.flush({}, { status: 500, statusText: 'Failed' });
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ code: RequestErrorCode.Server }));
  });
});
