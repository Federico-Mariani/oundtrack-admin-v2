import { Actions } from '@ngrx/effects';
import type { Action } from '@ngrx/store';
import { Subject, of, throwError } from 'rxjs';
import type { PageResult } from '@shared/types/pagination/page-result';
import type { MovieModel } from '../../../domain/models/movie.model';
import { DEFAULT_MOVIES_LIST_QUERY } from '../../../domain/models/movies-list-query.model';
import { MoviesLoadActions } from '../actions/movies-load.actions';
import { MoviesLoadApiActions } from '../actions/api/movies-load-api.actions';
import { loadMovies$ } from './movies-load.effects';

const page: PageResult<MovieModel> = { items: [], page: 1, limit: 20, total: 0 };
describe('Movies query concurrency', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it('cancels stale HTTP responses immediately and debounces consecutive searches', async () => {
    const actions = new Subject<Action>();
    const oldResponse = new Subject<PageResult<MovieModel>>();
    const getAll = vi.fn().mockReturnValueOnce(oldResponse).mockReturnValue(of(page));
    const emitted: Action[] = [];
    const subscription = loadMovies$(new Actions(actions), {
      getAll,
      getOne: vi.fn(),
      create: vi.fn(),
    }).subscribe((action) => emitted.push(action));
    actions.next(MoviesLoadActions.moviesLoadRequested({ query: DEFAULT_MOVIES_LIST_QUERY }));
    await vi.advanceTimersByTimeAsync(0);
    const first = { ...DEFAULT_MOVIES_LIST_QUERY, search: 'mat' };
    const latest = { ...DEFAULT_MOVIES_LIST_QUERY, search: 'matrix' };
    actions.next(MoviesLoadActions.moviesLoadRequested({ query: first, debounce: true }));
    oldResponse.next(page);
    expect(emitted).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(150);
    actions.next(MoviesLoadActions.moviesLoadRequested({ query: latest, debounce: true }));
    await vi.advanceTimersByTimeAsync(299);
    expect(getAll).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(getAll).toHaveBeenCalledTimes(2);
    expect(getAll).toHaveBeenLastCalledWith(latest);
    expect(emitted).toEqual([MoviesLoadApiActions.moviesLoaded({ result: page, query: latest })]);
    subscription.unsubscribe();
  });
  it('recovers an out-of-range page after the filtered total shrinks', async () => {
    const query = { ...DEFAULT_MOVIES_LIST_QUERY, page: 5 };
    const next = vi.fn();
    loadMovies$(new Actions(of(MoviesLoadActions.moviesLoadRequested({ query }))), {
      getOne: vi.fn(),
      create: vi.fn(),
      getAll: () => of({ ...page, page: 5, total: 21 }),
    }).subscribe(next);
    await vi.runAllTimersAsync();
    expect(next).toHaveBeenCalledWith(
      MoviesLoadActions.moviesLoadRequested({ query: { ...query, page: 2 } }),
    );
  });
  it('maps failures without terminating subsequent requests', async () => {
    const actions = new Subject<Action>();
    const error = { code: 'network' as const };
    const getAll = vi
      .fn()
      .mockReturnValueOnce(throwError(() => error))
      .mockReturnValue(of(page));
    const next = vi.fn();
    const subscription = loadMovies$(new Actions(actions), {
      getAll,
      getOne: vi.fn(),
      create: vi.fn(),
    }).subscribe(next);
    const request = MoviesLoadActions.moviesLoadRequested({ query: DEFAULT_MOVIES_LIST_QUERY });
    actions.next(request);
    await vi.runAllTimersAsync();
    expect(next).toHaveBeenCalledWith(
      MoviesLoadApiActions.moviesLoadFailed({ query: DEFAULT_MOVIES_LIST_QUERY, error }),
    );
    actions.next(request);
    await vi.runAllTimersAsync();
    expect(next).toHaveBeenLastCalledWith(
      MoviesLoadApiActions.moviesLoaded({ query: DEFAULT_MOVIES_LIST_QUERY, result: page }),
    );
    subscription.unsubscribe();
  });
});
