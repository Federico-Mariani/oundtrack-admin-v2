export const MoviesRequestOperation = {
  Create: 'Create',
  GetAll: 'Get All',
  GetById: 'Get By Id',
  CreateInfo: 'Create Info',
} as const;
export type MoviesRequestOperation =
  (typeof MoviesRequestOperation)[keyof typeof MoviesRequestOperation];
