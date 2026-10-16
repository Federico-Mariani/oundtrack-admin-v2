import { type Observable, catchError, map, of } from 'rxjs';
import type { RequestError } from './request/request-error';

export function resolveRequest<T, Success, Failure>(
  source: Observable<T>,
  succeeded: (value: T) => Success,
  failed: (error: RequestError) => Failure,
): Observable<Success | Failure> {
  return source.pipe(
    map(succeeded),
    catchError((error: RequestError) => of(failed(error))),
  );
}
