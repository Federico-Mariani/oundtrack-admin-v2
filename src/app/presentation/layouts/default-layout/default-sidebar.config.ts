import { MOVIES_NAVIGATION } from '@features/movies';
import type { SidebarGroup } from '../../ui/sidebar/sidebar-group';
import { GAME_CATEGORIES_NAVIGATION } from '@features/game-categories';
import { TV_SERIES_NAVIGATION } from '@features/tv-series';

/** Shell menu composition only. Feature paths remain owned by their routing APIs. */
export const DEFAULT_SIDEBAR_GROUPS: ReadonlyArray<SidebarGroup> = [
  {
    id: 'overview',
    items: [{ id: 'home', labelKey: 'sidebar.menu.home', icon: 'lucideHome', commands: ['/'] }],
  },
  {
    id: 'entities',
    labelKey: 'sidebar.menu.entities',
    items: [
      {
        id: 'gameCategories',
        labelKey: 'sidebar.menu.gameCategories.label',
        icon: 'lucideTags',
        commands: GAME_CATEGORIES_NAVIGATION.root(),
        exact: false,
        children: [
          {
            id: 'game-categories-all',
            labelKey: 'sidebar.menu.gameCategories.all',
            commands: GAME_CATEGORIES_NAVIGATION.root(),
          },
        ],
      },
      {
        id: 'movies',
        labelKey: 'sidebar.menu.movies.label',
        icon: 'lucideFilm',
        commands: MOVIES_NAVIGATION.root(),
        exact: false,
        children: [
          {
            id: 'movies-all',
            labelKey: 'sidebar.menu.movies.all',
            commands: MOVIES_NAVIGATION.root(),
          },
          {
            id: 'movies-create',
            labelKey: 'sidebar.menu.movies.createOne',
            commands: MOVIES_NAVIGATION.create(),
          },
        ],
      },
      {
        id: 'tv-series',
        labelKey: 'sidebar.menu.tvSeries.label',
        icon: 'lucideFilm',
        commands: TV_SERIES_NAVIGATION.root(),
        exact: false,
        children: [
          {
            id: 'tv-series-all',
            labelKey: 'sidebar.menu.tvSeries.all',
            commands: TV_SERIES_NAVIGATION.root(),
          },
          {
            id: 'tv-series-create',
            labelKey: 'sidebar.menu.tvSeries.createOne',
            commands: TV_SERIES_NAVIGATION.create(),
          },
        ],
      },
    ],
  },
];
