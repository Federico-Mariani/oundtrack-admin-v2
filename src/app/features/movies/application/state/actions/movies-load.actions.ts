import { createActionGroup, emptyProps } from '@ngrx/store';

export const MoviesLoadActions = createActionGroup({
  source: 'MOVIES - Load',
  events: {
    'Movies Load Requested': emptyProps(),
  },
});
