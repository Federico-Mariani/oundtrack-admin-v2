# Catalog detail navigation and categories

Movies and TV series use the same catalog URL codec and detail-dialog lifecycle. Feature-owned navigation services update query parameters without removing unrelated parameters.

## URL state

| Parameter                                | Meaning                                              |
| ---------------------------------------- | ---------------------------------------------------- |
| `search`                                 | Table search text                                    |
| `releaseYearFrom`, `releaseYearTo`       | Inclusive year filters                               |
| `externalMovieId` / `externalTvSeriesId` | Feature-specific external identifier                 |
| `sortBy`, `sortOrder`                    | Supported sort field and `asc`/`desc`                |
| `page`, `limit`                          | Pagination; defaults are 1 and 20                    |
| `detail`                                 | Entity identifier whose detail dialog should be open |

For example: `/movies?search=Dune&releaseYearFrom=2020&detail=d79af3f8-da40-4974-ae94-4217fbc95150`.

Query parameters are the source of truth on first render, reload and browser history navigation. Defaults are omitted when writing the URL. Invalid numbers, unsupported sorting and invalid identifiers fall back safely. Filter changes reset the page and replace the current history entry; opening a detail pushes an entry. Closing removes only `detail`, preserving the filters. A late close callback cannot remove a newly opened entity. Changing only the detail identifier does not reload the table.

## Loading

Opening the shared catalog detail starts the hint request independently of the active tab and movie/series response. The detail owns the hint session, so tab changes and locale changes do not clear or reload hints. The lazy hint panel and its translations are prefetched at the same time; audio translations are also prefetched. Translation preloads share in-flight promises with the actual controls and failed loads can be retried.

The initial detail shimmer follows the header, category rows, tabs, audio cards and metadata geometry. Its animation appears only after 150 ms to avoid a brief shimmer for fast responses. Audio and hint placeholders also cover lazy UI/translation loading. Existing detail and hint content remain mounted during refresh; the hint header exposes an independent refresh action.

## Category assignment

The GameCategories feature owns a reusable editor consumed through its public API. Empty category lists show an add button; populated lists show an adjacent plus icon. The editor retrieves all categories with `GET /game-categories`, preselects the current IDs, filters names locally and supports selecting any number of categories, including zero.

Saving posts to `/game-categories/set-for-owner` with `{ ownerType, ownerId, gameCategoryIds }`. Owner types are `movie` and `tv_series`; the API replaces the entire selection, and an empty array removes all links. The response may have an empty body. Saving is disabled until loading succeeds and the selection changes. Only successful changes close the editor with a mutation result and refresh the catalog detail. Failures preserve the selection, show inline feedback and a notification, and permit retry.

The assignment operation has its own NgRx request state and session/request correlation. Duplicate saves are ignored; closing an editor cancels its subscription, and stale responses cannot update a new editor. Cancellation does not roll back writes already accepted by the server.
