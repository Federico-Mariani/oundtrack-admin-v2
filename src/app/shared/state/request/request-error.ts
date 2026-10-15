export type RequestErrorCode =
  | 'network'
  | 'bad-request'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'conflict'
  | 'validation'
  | 'server'
  | 'unknown';

export interface RequestError {
  readonly status?: number;
  readonly code: RequestErrorCode;
  readonly message?: string;
  readonly fieldErrors?: Readonly<Record<string, ReadonlyArray<string>>>;
}
