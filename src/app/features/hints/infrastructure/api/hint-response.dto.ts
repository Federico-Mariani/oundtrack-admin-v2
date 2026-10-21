export interface HintResponseDto {
  readonly id: string;
  readonly type: string;
  readonly icon: string | null;
  readonly cost: number;
  readonly info: ReadonlyArray<{
    readonly id: string;
    readonly language: string;
    readonly text: string | null;
    readonly image: string | null;
  }>;
  readonly createdAt: number;
  readonly updatedAt: number;
}
