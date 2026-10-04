/** Body of `POST /register`. */
export interface RegistrationRequestDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}
