/** Explicit paginated transport contract; non-paginated envelopes are unchanged. */
export interface PaginatedApiResponse<T> {
  readonly data: ReadonlyArray<T>;
  readonly meta: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
  };
}
