export const RequestErrorCode = {
  Network: 'network',
  BadRequest: 'bad-request',
  Unauthorized: 'unauthorized',
  Forbidden: 'forbidden',
  NotFound: 'not-found',
  Conflict: 'conflict',
  Validation: 'validation',
  Server: 'server',
  Unknown: 'unknown',
} as const;
export type RequestErrorCode = (typeof RequestErrorCode)[keyof typeof RequestErrorCode];

export interface RequestError {
  readonly status?: number;
  readonly code: RequestErrorCode;
  readonly message?: string;
  readonly fieldErrors?: Readonly<Record<string, ReadonlyArray<string>>>;
}
