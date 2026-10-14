import type { CreateMovieModel } from '../../domain/models/create-movie.model';
import type { Observable } from 'rxjs';
import type { MovieModel } from '../../domain/models/movie.model';
import type { MoviesListQuery } from '../../domain/models/movies-list-query.model';
import type { PageResult } from '@shared/types/pagination/page-result';
export interface MoviesRepositoryPort {
  create(movie: CreateMovieModel): Observable<MovieModel>;
  getAll(query: MoviesListQuery): Observable<PageResult<MovieModel>>;
}
