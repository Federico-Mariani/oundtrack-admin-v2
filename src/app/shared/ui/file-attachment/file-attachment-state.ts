export const FileAttachmentState = {
  Idle: 'idle',
  Uploading: 'uploading',
  Processing: 'processing',
  Error: 'error',
  Done: 'done',
} as const;
export type FileAttachmentState = (typeof FileAttachmentState)[keyof typeof FileAttachmentState];
