export const RequestStatus = {
  Idle: 'idle',
  Pending: 'pending',
  Success: 'success',
  Error: 'error',
} as const;
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];
