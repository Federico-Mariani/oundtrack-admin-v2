import { createActionGroup, emptyProps } from '@ngrx/store';

export const GameCategoriesLoadActions = createActionGroup({
  source: 'Game Categories Load',
  events: {
    'Game Categories Load Requested': emptyProps(),
  },
});
