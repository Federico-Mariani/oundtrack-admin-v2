import { createFeature } from '@ngrx/store';
import { tvSeriesReducer } from './tv-series.reducer';
import { TV_SERIES_STATE_DEFINITION } from './tv-series-state-definition';

export const TV_SERIES_FEATURE_KEY = TV_SERIES_STATE_DEFINITION.key;

export const tvSeriesFeature = createFeature({
  name: TV_SERIES_FEATURE_KEY,
  reducer: tvSeriesReducer,
});
