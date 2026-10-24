# Game category management

The GameCategories page offers creation and management actions. The editor accepts a name in at least one supported locale; additional translations can be entered now or later. Existing translations can be updated, but clearing an existing name does not delete it. Names are trimmed and limited to 255 characters.

A shared, optional icon can be selected using keyboard browsing or drag and drop. The selected file replaces the drop target with the reusable Attachment summary and square preview. The same image selection, validation and upload field are used by hints. Supported formats are JPEG and PNG up to 10 MiB; validation includes MIME, extension, signature and image decoding. Replacing the selection or closing releases file references and object URLs.

## API and workflow

| Operation              | Endpoint                                     | Body                          |
| ---------------------- | -------------------------------------------- | ----------------------------- |
| Create category        | `POST /game-categories`                      | `{ name, language }`          |
| Add/update translation | `POST /game-categories/{id}/info`            | `{ name, language }`          |
| Request icon upload    | `POST /game-categories/{id}/icon/upload-url` | `{ contentType }`             |
| Transfer file          | Returned signed URL, direct PUT              | Raw file and returned headers |
| Confirm icon           | `POST /game-categories/{id}/icon/complete`   | `{ contentType, key }`        |

UI locale `en-US` maps to API locale `en-EN`. Creation returns the identity used for all remaining translations. Each response updates the checkpoint and list. The upload starts after metadata; confirmation uses the exact key returned by the upload endpoint. Direct PUT bypasses API authorization and locale interceptors. Progress and the button loader remain visible through confirmation.

Names and successful upload checkpoints survive failures. Retry skips unchanged translations and, after a successful PUT, repeats only confirmation. A rejected confirmation clears the upload checkpoint. A different local file starts a new transfer. Ambiguous initial creation errors disable blind resubmission; closing reloads the list to reconcile the result. Session/request IDs prevent duplicate submissions and obsolete responses. Files stay outside NgRx.

Deploy the category-icon API before enabling the Admin flow. Backend image URLs are already signed and are not reconstructed by the client. Storage CORS requirements are the same as existing direct image uploads. See the API documentation for the versioned key prefix and permissions.
