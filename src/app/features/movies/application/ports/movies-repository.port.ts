import type { CreateMovieInfoModel } from '../../domain/models/create-movie-info.model';
import type { CreateMovieModel } from '../../domain/models/create-movie.model';
import type { MovieDetailModel } from '../../domain/models/movie-detail.model';
import type { Id } from '@shared/types/id';
import type { Observable } from 'rxjs';
import type { MovieModel } from '../../domain/models/movie.model';
import type { MoviesListQuery } from '../../domain/models/movies-list-query.model';
import type { PageResult } from '@shared/types/pagination/page-result';
export interface MoviesRepositoryPort {
  createInfo(request: CreateMovieInfoModel): Observable<void>;
  getOne(id: Id): Observable<MovieDetailModel>;
  create(movie: CreateMovieModel): Observable<MovieModel>;
  getAll(query: MoviesListQuery): Observable<PageResult<MovieModel>>;
}
