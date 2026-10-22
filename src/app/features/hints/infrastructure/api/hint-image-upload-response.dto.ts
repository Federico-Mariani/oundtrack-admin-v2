export interface HintImageUploadResponseDto {
  readonly url: string;
  readonly method: 'PUT';
  readonly headers: Readonly<Record<string, string>>;
  readonly key: string;
  readonly expiresInSeconds: number;
}
