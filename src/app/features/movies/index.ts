/**
 * Public API of the Movies feature.
 * Other features and the app shell must import from here only;
 * everything else inside `features/movies` is an implementation detail.
 */
export { MoviesFacade } from './application/state/facades/movies.facade';
export { provideMovies } from './movies.providers';
export { MOVIES_ROUTES } from './presentation/routing/movies.routes';
export { MOVIES_PATHS } from './presentation/routing/movies.paths';
export { MOVIES_NAVIGATION } from './presentation/routing/movies.navigation';
