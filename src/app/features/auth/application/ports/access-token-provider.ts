/**
 * Port exposing the current access token to infrastructure (the HTTP
 * interceptor) without coupling it to NgRx or to the facades.
 *
 * `auth.providers.ts` binds it to `AuthStoreDataFacade`, whose `accessToken`
 * Signal satisfies this contract structurally: the store stays the single
 * source of truth.
 */
export interface AccessTokenProvider {
  accessToken(): string | null;
}
