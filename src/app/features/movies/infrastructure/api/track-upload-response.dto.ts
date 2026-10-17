export interface TrackUploadResponseDto {
  readonly trackId: string;
  readonly key: string;
  readonly url: string;
  readonly method: 'PUT';
  readonly headers: Readonly<Record<string, string>>;
  readonly expiresInSeconds: number;
}
