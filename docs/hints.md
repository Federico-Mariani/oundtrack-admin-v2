# Catalog hints

Movies and TV series share the Hints feature in the catalog detail Line tabs. Hint mutations update the hint list without reloading the movie/series modal. Initial loading uses skeletons; refresh preserves current content. Card language badges use the shared LanguageTags component.

## Content by type

Actor and Frame use one JPEG/PNG image and have no text input. Year, Quote and Plot require text and cannot select or upload files. The image is shared across every translation of a hint; adding a language inherits it. Replacing the image updates all translations. The editor explains this before selection.

Image selection reuses FileDropzone and FileAttachment (Spartan Attachment). A selected file replaces the drop target, with a contained preview and a removal action. Validation checks a single file, extension, MIME type, signature, nonzero size, the 10 MiB limit and browser decoding. Object URLs and files held outside NgRx are released when replaced or when the editor is destroyed.

## API contract

Verified against `oundtrack-api-v2` master and `docs/api/hint-images.md`.

| Operation            | Endpoint                            | Body                                                              |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| List                 | `GET /hints/owner/{ownerId}`        | None                                                              |
| Create               | `POST /hints`                       | `ownerId`, `ownerType`, `type`, `language`; `text` for text hints |
| Add translation      | `POST /hints/{id}/info`             | `language`; `text` for text hints                                 |
| Edit text            | `PATCH /hints/{id}`                 | `language`, `text`                                                |
| Request image upload | `POST /hints/{id}/image/upload-url` | `contentType`                                                     |
| Transfer image       | Returned signed S3 URL, `PUT`       | Raw file bytes and returned headers                               |
| Confirm image        | `POST /hints/{id}/image/complete`   | Same `contentType`                                                |
| Delete hint          | `DELETE /hints/{id}`                | None; 204; backend deletes owned images                           |

Owner types are `movie` and `tv_series`. English UI locale `en-US` maps to API `en-EN`. The server assigns icon and cost; the Admin never submits icon, image path or cost. The read-only UI price map remains Actor 200, Plot 300, Frame 300, Quote 200, Year 100. There is no bulk rewrite of existing records.

Server-assigned icon keys are `hints/icons/{type}_icon.png`; these assets must exist in the configured bucket. Client-generated SVG icons and their obsolete key mapping have been removed. Image keys are assigned by the backend as `hints/{ownerId}/{hintId}.jpg` or `.png`. Response images and icons are already signed URLs and are never sent back as object keys.

## Upload lifecycle and recovery

1. Validate and preview a selected image locally.
2. Create the hint or add its translation, if necessary. Retain the returned hint as a checkpoint and immediately reconcile the list.
3. Obtain an upload URL and send the raw file through DirectFileUpload, the same XHR transport used by soundtracks. This bypasses API interceptors, bearer tokens and locale headers while reporting upload progress.
4. Confirm the upload. Only a successful confirmation closes the modal and displays success. The loader remains active through metadata saving, transfer and confirmation.

Upload errors retain the selection and metadata checkpoint. Retrying a failed transfer requests a fresh URL without creating the hint or translation again. If only confirmation failed, retry confirmation without another PUT. A confirmation 409 clears the uploaded-file checkpoint and allows a new upload. Selecting a different file always starts a new transfer.

An ambiguous network/server failure before receiving a creation response disables blind resubmission. Closing the editor refreshes the hint list so the user can reconcile the result. Partial hint creation remains visible and can be completed from its edit action. Cancellation does not pretend to roll back server-side work.

Session and request IDs reject stale results and duplicate submissions. Writes are serialized within the panel; close and file selection controls are disabled during saving. Destroying the owner cancels subscriptions. Browser File objects stay in UploadFiles, not in NgRx state.

## Deployment and verification limits

The API must include the image endpoints and updated create/PATCH DTOs. S3 CORS must permit PUT and Content-Type from the Admin origin, and the API identity needs the documented S3 permissions. No AWS resources are modified by this change.

The fixed storage key means replacing a file may overwrite S3 before confirmation. Existing CloudFront caches may continue serving an older image until invalidation/expiry. The client does not change signed query strings or claim distributed rollback. Backend upload cleanup and CDN cache policy remain operational concerns documented by the API project.

Automated checks cover current HTTP payloads, image-only UI, validation/decoding/resource cleanup, retry checkpoints, progress, confirmation, stale results and text-hint rejection. They do not perform live storage writes.
