export const TvSeriesRequestOperation = {
  Create: 'Create',
  GetAll: 'Get All',
  GetById: 'Get By Id',
  CreateInfo: 'Create Info',
} as const;
export type TvSeriesRequestOperation =
  (typeof TvSeriesRequestOperation)[keyof typeof TvSeriesRequestOperation];
