import type { CreateMovieInfoCommand } from '../commands/create-movie-info.command';
import type { CreateMovieCommand } from '../commands/create-movie.command';
import type { MovieDetailModel } from '../../domain/models/movie-detail.model';
import type { Id } from '@shared/types/id';
import type { Observable } from 'rxjs';
import type { MovieModel } from '../../domain/models/movie.model';
import type { MoviesListQuery } from '../queries/movies-list.query';
import type { PageResult } from '@shared/types/pagination/page-result';
export interface MoviesRepositoryPort {
  createInfo(request: CreateMovieInfoCommand): Observable<void>;
  getOne(id: Id): Observable<MovieDetailModel>;
  create(movie: CreateMovieCommand): Observable<MovieModel>;
  getAll(query: MoviesListQuery): Observable<PageResult<MovieModel>>;
}
