/** Body of `POST /login`. The backend expects the email in the `username` field. */
export interface LoginRequestDto {
  readonly username: string;
  readonly password: string;
}
