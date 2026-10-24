import { TV_SERIES_PATHS } from './tv-series.paths';

export const TV_SERIES_NAVIGATION = {
  root: () => ['/', TV_SERIES_PATHS.root] as const,
} as const;
