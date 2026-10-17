# Movie soundtrack management

The Movie detail dialog supports creating a soundtrack, adding another recording, assigning one recording to several supported languages, and uploading or replacing MP3 audio. A language can belong to only one recording in a soundtrack. “Show all language versions” exposes recordings outside the currently selected movie language, including recordings awaiting audio.

## Backend prerequisite

Contracts were checked against `Federico-Mariani/oundtrack-api-v2` master `2474683a62f685ed2cefeb61d25e2b135b2adbca` and upload branch `feat/direct-s3-track-uploads` at `1d97b1dba457722de2e279e92688d53ae663f97e`. The upload endpoints are on that branch, not the inspected master. Deploy that backend implementation before using uploads in Admin. No backend changes or deployment are included in this change.

| Operation                               | Endpoint                                             | Body                                                            |
| --------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------- |
| Create soundtrack and initial recording | POST `/soundtracks`                                  | `ownerType: 'movie'`, `ownerId`, `trackExternalId`, `languages` |
| Add recording                           | POST `/soundtracks/{soundtrackId}/tracks`            | `externalId`, `languages`                                       |
| Assign recording languages              | PATCH `/soundtracks/tracks/{trackId}/languages`      | `languages`                                                     |
| Obtain signed upload URL                | POST `/soundtracks/tracks/{trackId}/upload-url`      | Empty object                                                    |
| Confirm upload                          | POST `/soundtracks/tracks/{trackId}/upload/complete` | Empty object                                                    |

All endpoints use the configured API prefix and return a `data` envelope. Track metadata comes from the provider using the Spotify track ID. Admin maps its English locale `en-US` to API `en-EN`. The create and update requests send language arrays.

The presign response supplies the URL and exact `Content-Type: audio/mpeg` header for a raw-byte PUT. A dedicated XHR HttpClient bypasses application interceptors, so API authorization cannot leak to S3 and upload progress is available. Files and signed URLs never enter NgRx or DevTools. S3 must permit the deployed Admin origin, PUT and Content-Type through bucket CORS. Playback uses the API-returned path after successful completion. Check CloudFront cache behavior when replacing an existing object.

## Recovery and lifetime

Each editor has a correlation ID. Exhaust-map submission prevents duplicate writes; closing, resetting or stopping the upload cancels the active observable. Reducers reject results outside the active editor or pending request. The form remains busy through confirmation, not just during the API creation call.

The created track is a checkpoint. Upload retries obtain a new signed URL for the same track. Confirmation retries skip both creation and upload; an explicit “Upload the file again” action resets that checkpoint. Stopping an upload retains the track and allows retry. Closing releases the in-memory file and refreshes the Movie; a partially created track can be resumed from its card by selecting the file again.

The backend does not offer an idempotency key for creation. An ambiguous creation failure (network or server error before an ID is received) therefore blocks blind retry in the same editor and asks the user to close and inspect the refreshed Movie. No automatic rollback or deletion occurs.

Client validation checks the extension, a nonempty file and ID3/MPEG header bytes before any creation request. This is a basic format check, not a full MP3 decoder. The inspected upload API validates object existence, size and MIME type at confirmation. No arbitrary upload size limit is invented by Admin.

## Verification

Automated coverage includes API URLs and locale mapping, raw isolated upload transport, creation/upload/confirmation ordering, duplicate submissions, retries from each checkpoint, cancellation, stale editor results, ambiguous creation failures, and language updates. Real S3 CORS, backend deployment and playback after replacement require integration verification against the deployed services.
