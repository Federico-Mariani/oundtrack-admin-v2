import type { Observable } from 'rxjs';
import type { MovieModel } from '../../domain/models/movie.model';
import type { MoviesListQuery } from '../../domain/models/movies-list-query.model';
import type { PageResult } from '@shared/types/pagination/page-result';
export interface MoviesRepositoryPort {
  getAll(query: MoviesListQuery): Observable<PageResult<MovieModel>>;
}
