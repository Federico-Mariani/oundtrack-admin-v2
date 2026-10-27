import { AVATARS_NAVIGATION } from '@features/avatars';
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
        id: 'avatars',
        labelKey: 'sidebar.menu.avatars',
        icon: 'lucideUserRound',
        commands: AVATARS_NAVIGATION.root(),
        exact: false,
      },
      {
        id: 'gameCategories',
        labelKey: 'sidebar.menu.gameCategories.label',
        icon: 'lucideTags',
        commands: GAME_CATEGORIES_NAVIGATION.root(),
        exact: false,
      },
      {
        id: 'movies',
        labelKey: 'sidebar.menu.movies.label',
        icon: 'lucideFilm',
        commands: MOVIES_NAVIGATION.root(),
        exact: false,
      },
      {
        id: 'tv-series',
        labelKey: 'sidebar.menu.tvSeries.label',
        icon: 'lucideTv',
        commands: TV_SERIES_NAVIGATION.root(),
        exact: false,
      },
    ],
  },
];
