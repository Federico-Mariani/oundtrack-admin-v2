export interface AvatarUploadResponseDto {
  readonly url: string;
  readonly key: string;
  readonly headers: Readonly<Record<string, string>>;
}
