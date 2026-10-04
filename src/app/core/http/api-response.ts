/**
 * Envelope returned by every backend endpoint: `{ data, _meta }`.
 * Infrastructure-only contract; it must never leak into domain or application code.
 */
export interface ApiResponse<TData, TMeta = null> {
  readonly data: TData;
  readonly _meta: TMeta | null;
}

/**
 * Body returned by the backend when a request fails.
 */
export interface ApiErrorBody {
  readonly message?: string;
  readonly fields?: Readonly<Record<string, string>>;
}
