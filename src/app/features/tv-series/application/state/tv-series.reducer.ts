import { createReducer } from '@ngrx/store';
import { tvSeriesAudioReducer } from './reducers/tv-series-audio.reducer';
import { tvSeriesGetAllReducer } from './reducers/tv-series-get-all.reducer';
import { tvSeriesCreateReducer } from './reducers/tv-series-create.reducer';
import { tvSeriesDetailReducer } from './reducers/tv-series-detail.reducer';
import { tvSeriesInfoCreateReducer } from './reducers/tv-series-info-create.reducer';
import { initialTvSeriesState } from './tv-series.state';

export const tvSeriesReducer = createReducer(
  initialTvSeriesState,
  ...tvSeriesAudioReducer,
  ...tvSeriesGetAllReducer,
  ...tvSeriesCreateReducer,
  ...tvSeriesDetailReducer,
  ...tvSeriesInfoCreateReducer,
);
