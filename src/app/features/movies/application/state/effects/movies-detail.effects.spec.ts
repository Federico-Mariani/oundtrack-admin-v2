import { Actions } from '@ngrx/effects';
import type { Action } from '@ngrx/store';
import { Subject, of, throwError } from 'rxjs';
import type { MoviesRepositoryPort } from '../../ports/movies-repository.port';
import type { MovieDetailModel } from '../../../domain/models/movie-detail.model';
import { loadMovieDetail$ } from './movies-detail.effects';
import { MoviesDetailActions } from '../actions/movies-detail.actions';
import { MoviesDetailApiActions } from '../actions/api/movies-detail-api.actions';
const movie: MovieDetailModel = {
  id: 'one',
  externalMovieId: 1,
  info: {},
  genres: [],
  soundtracks: [],
  gameCategories: [],
  createdAt: 0,
  updatedAt: 0,
};
describe('Movie detail effects', () => {
  it('cancels replaced and closed requests and can reopen the same movie', () => {
    const actions = new Subject<Action>();
    const first = new Subject<MovieDetailModel>();
    const second = new Subject<MovieDetailModel>();
    const repository: MoviesRepositoryPort = {
      getOne: vi
        .fn()
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second)
        .mockReturnValue(of(movie)),
      getAll: vi.fn(),
      create: vi.fn(),
    };
    const next = vi.fn();
    const subscription = loadMovieDetail$(new Actions(actions), repository).subscribe(next);
    actions.next(MoviesDetailActions.requested({ id: 'one' }));
    actions.next(MoviesDetailActions.requested({ id: 'two' }));
    first.next(movie);
    actions.next(MoviesDetailActions.closed({ id: 'two' }));
    second.next(movie);
    expect(next).not.toHaveBeenCalled();
    actions.next(MoviesDetailActions.requested({ id: 'one' }));
    expect(next).toHaveBeenCalledExactlyOnceWith(
      MoviesDetailApiActions.succeeded({ id: 'one', movie }),
    );
    subscription.unsubscribe();
  });
  it('emits mapped errors and remains available for retry', () => {
    const actions = new Subject<Action>();
    const error = { code: 'not-found' as const, status: 404 };
    const repository: MoviesRepositoryPort = {
      getOne: vi
        .fn()
        .mockReturnValueOnce(throwError(() => error))
        .mockReturnValue(of(movie)),
      getAll: vi.fn(),
      create: vi.fn(),
    };
    const next = vi.fn();
    const subscription = loadMovieDetail$(new Actions(actions), repository).subscribe(next);
    actions.next(MoviesDetailActions.requested({ id: 'one' }));
    expect(next).toHaveBeenLastCalledWith(MoviesDetailApiActions.failed({ id: 'one', error }));
    actions.next(MoviesDetailActions.requested({ id: 'one' }));
    expect(next).toHaveBeenLastCalledWith(MoviesDetailApiActions.succeeded({ id: 'one', movie }));
    subscription.unsubscribe();
  });
});
