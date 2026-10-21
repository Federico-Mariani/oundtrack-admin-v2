# Catalog hints

Movies and TV series share the Hints feature through the catalog detail tabs. The panel is loaded on first use and stays mounted when switching tabs. Switching tabs pauses soundtrack playback. Initial loading uses skeletons; refresh preserves the current list. Saving or closing a hint dialog never reloads the movie or series detail.

## Backend contract

Verified against `oundtrack-api-v2` master, `src/modules/hints`.

| Operation                                   | Endpoint                     | Body                                                               |
| ------------------------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| List                                        | `GET /hints/owner/{ownerId}` | None; response includes all translations                           |
| Create                                      | `POST /hints`                | `ownerId`, `ownerType`, `type`, `cost`, `icon`, `language`, `text` |
| Add translation                             | `POST /hints/{id}/info`      | `language`, `text`                                                 |
| Delete hint                                 | `DELETE /hints/{id}`         | None; 204                                                          |
| Edit (proposed, not implemented by backend) | `PATCH /hints/{id}`          | `type`, `cost`, `icon`, `language`, `text`                         |

Owner types are `movie` and `tv_series`. A type can occur only once per owner. Costs are nonnegative integers. The UI normalizes `en-US` to the backend's `en-EN`. A translation cannot be added twice. Create and translation responses contain the updated hint and are applied to the local list without another GET.

The editor requires text content. Existing image content is displayed when supplied by the API. The illustration identifying a hint type is separate from its clue content: a frame illustration is not a film still. There is no image upload control. Image-only hint creation is not part of this text-based editor.

Edit intentionally issues PATCH and retains the form on failure. A 404/405 explains that editing is not yet available. There is no destructive delete/recreate fallback. The future endpoint must return `{ data: HintResponseDto }` containing the complete hint and translations. Confirm this proposed payload with the backend when implementing it.

## Fixed illustrations and storage prerequisite

Five bundled SVG illustrations live in `public/assets/hints/`: actor, year, frame, quote and plot. The editor previews these illustrations; list cards use theme-aware Lucide icons and the shared language tags. `HINT_ICONS` centralizes the corresponding backend object keys: `hints/icons/{type}.svg`.

The backend signs `icon` as a storage object key. **Before production use, publish these five SVG files into the backend's media storage at those keys**, with `image/svg+xml` content type and the existing media access configuration. These keys are a new convention, not verified existing storage objects. Update the centralized mapping if deployment uses different keys. The Admin does not upload them during hint creation. Signed response URLs are never sent back as object keys.

## State and failure handling

The feature owns domain values/models, command and repository port, HTTP DTO mapping, NgRx requests/effects/facades, and presentation. Every load and mutation is correlated with panel session and request ID. Duplicate submissions and requests for the wrong owner are ignored; closing a session invalidates outstanding results. Mutations cancel older reads so stale data cannot replace a successful write. API errors remain separate per operation and preserve the editor's input. A delete requires an explicit confirmation dialog.

No live backend or storage mutation is performed by automated checks. HTTP contract tests and workflow tests exercise both owner types, locale mapping, future edit errors, conflicts, deletion, retry, stale responses and duplicate submissions.

## Requested follow-up

The detail tabs now use Spartan's Line variant. Hint cards separate the clue content from cost and actions, use a reusable action menu, and display existing clue images without cropping.

Image upload and fixed per-type pricing are not implemented yet. The current backend accepts a supplied cost and an existing storage object key, but has no hint-image upload endpoint or authoritative per-type price catalog. The five costs must be supplied before replacing the editable cost with a fixed policy. Actor and Frame require a visual-content editor and an end-to-end upload contract; a local file preview must not be presented as a completed upload.
