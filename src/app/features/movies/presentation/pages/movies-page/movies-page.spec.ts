import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, Subject } from 'rxjs';
import { MoviesPage } from './movies-page';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { MoviesNavigationService } from '../../routing/movies-navigation.service';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ModalService } from '@shared/ui/modal/modal.service';
describe('Movies URL restoration', () => {
  it('restores filters and detail immediately without reloading the list on modal navigation', () => {
    const initial = convertToParamMap({
      search: 'Dune',
      releaseYearFrom: '2020',
      page: '2',
      detail: 'movie-1',
    });
    const params = new BehaviorSubject(initial),
      snapshot = { queryParamMap: initial };
    const loadMovies = vi.fn(),
      navigate = vi.fn(),
      closed = new Subject<void>(),
      forceClose = vi.fn();
    const open = vi.fn(() => ({ closed$: closed.asObservable(), forceClose }));
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: params, snapshot } },
        { provide: MoviesNavigationService, useValue: { updateCatalogQuery: navigate } },
        { provide: LanguageService, useValue: { activeLocale: signal('en-US') } },
        { provide: NotificationService, useValue: {} },
        { provide: TranslocoService, useValue: {} },
        { provide: ModalService, useValue: { open } },
        {
          provide: MoviesFacade,
          useValue: {
            data: { total: signal(0), movies: signal([]) },
            requests: { getAll: { isLoading: signal(false), error: signal(null) } },
            actions: { loadMovies },
          },
        },
      ],
    });
    TestBed.overrideComponent(MoviesPage, { set: { imports: [], template: '' } });
    const fixture = TestBed.createComponent(MoviesPage);
    fixture.detectChanges();
    expect(loadMovies).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        search: 'Dune',
        filters: { releaseYearFrom: 2020, releaseYearTo: undefined, externalMovieId: undefined },
      }),
      true,
    );
    expect(open).toHaveBeenCalledWith(expect.anything(), { id: 'movie-1' }, expect.anything());
    snapshot.queryParamMap = convertToParamMap({
      search: 'Dune',
      releaseYearFrom: '2020',
      page: '2',
    });
    params.next(snapshot.queryParamMap);
    fixture.detectChanges();
    expect(loadMovies).toHaveBeenCalledTimes(1);
    expect(forceClose).toHaveBeenCalledTimes(1);
    closed.next();
    expect(navigate).not.toHaveBeenCalled();
    snapshot.queryParamMap = convertToParamMap({ search: 'Alien' });
    params.next(snapshot.queryParamMap);
    fixture.detectChanges();
    expect(loadMovies).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, search: 'Alien' }),
      true,
    );
    fixture.destroy();
  });
});
