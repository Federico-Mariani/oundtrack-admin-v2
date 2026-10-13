import { MOVIES_NAVIGATION } from '@features/movies';
import type { SidebarGroup } from '../../ui/sidebar/sidebar-group';

/** Shell menu composition only. Feature paths remain owned by their routing APIs. */
export const DEFAULT_SIDEBAR_GROUPS: readonly SidebarGroup[] = [
  {
    id: 'overview',
    items: [{ id: 'home', labelKey: 'sidebar.menu.home', icon: 'lucideHome', commands: ['/'] }],
  },
  {
    id: 'entities',
    labelKey: 'sidebar.menu.entities',
    items: [
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
    ],
  },
];
