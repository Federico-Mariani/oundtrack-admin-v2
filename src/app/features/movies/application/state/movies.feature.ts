import { createFeature, createSelector } from '@ngrx/store';
import { isRequestPending, requestError } from '@shared/state/request/request-state.queries';
import { moviesReducer } from './movies.reducer';

export const MOVIES_FEATURE_KEY = 'movies';

export const moviesFeature = createFeature({
  name: MOVIES_FEATURE_KEY,
  reducer: moviesReducer,
  extraSelectors: ({
    selectLoadRequest,
    selectCreateRequest,
    selectDetailRequest,
    selectCreateInfoRequest,
  }) => ({
    selectIsCreatingInfo: createSelector(selectCreateInfoRequest, isRequestPending),
    selectCreateInfoError: createSelector(selectCreateInfoRequest, requestError),
    selectInfoCreated: createSelector(
      selectCreateInfoRequest,
      (request) => request.status === 'success',
    ),
    selectIsLoadingDetail: createSelector(selectDetailRequest, isRequestPending),
    selectMovieDetailError: createSelector(selectDetailRequest, requestError),
    selectIsCreatingMovie: createSelector(selectCreateRequest, isRequestPending),
    selectMovieCreateError: createSelector(selectCreateRequest, requestError),
    selectMovieCreated: createSelector(
      selectCreateRequest,
      (request) => request.status === 'success',
    ),
    selectIsLoadingMovies: createSelector(selectLoadRequest, isRequestPending),

    selectMoviesLoadError: createSelector(selectLoadRequest, requestError),
  }),
});
