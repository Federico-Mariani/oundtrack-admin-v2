export const AvatarSavePhase = { Idle: 'idle', Upload: 'upload', Confirm: 'confirm' } as const;
export type AvatarSavePhase = (typeof AvatarSavePhase)[keyof typeof AvatarSavePhase];
