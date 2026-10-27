# Avatar management

The Avatars sidebar link opens the catalog table with image previews, identifiers, creation/update timestamps, local ID search, refresh, copy ID and edit actions. Avatars do not have translated names in the API.

Creation and replacement use the same modal and shared image selection, dashed dropzone, Attachment summary and progress controls. The Admin accepts one PNG or JPEG up to 10 MiB, validating the extension, signature and decoded image. Square images are recommended; previews preserve the full image. No CSS was added.

The NgRx feature owns independent load/save requests. Session and request IDs reject stale results, duplicate submissions are ignored and closing an editor cancels its subscriptions. The modal blocks dismissal during saving. Errors preserve the selected file, while successful saving closes the modal and refreshes the catalog; cancelling does not reload it.

## API contract

| Operation              | Endpoint                           | Body                      |
| ---------------------- | ---------------------------------- | ------------------------- |
| List                   | GET /avatars                       | —                         |
| Request upload         | POST /avatars/upload-url           | `{ contentType }`         |
| Transfer               | Signed URL, direct PUT             | File and returned headers |
| Create after upload    | POST /avatars/upload/complete      | `{ key, contentType }`    |
| Replace existing image | POST /avatars/{id}/upload/complete | `{ key, contentType }`    |

Direct uploads bypass API interceptors. The loader remains active through confirmation. After a successful transfer, retrying a network/server failure repeats only confirmation with the same key. A rejected upload key or a different local file starts a new transfer. API confirmation is idempotent for the same key.

Replacement keeps the avatar ID and affects profiles already using it; the modal explains this before saving. The API retains the previous storage object, so cleanup must exclude keys referenced by the database. Deploy the complete avatar upload API, including replacement, before this Admin section. Local checks use placeholder environment configuration and fake HTTP/storage; no deployed storage test is implied.
