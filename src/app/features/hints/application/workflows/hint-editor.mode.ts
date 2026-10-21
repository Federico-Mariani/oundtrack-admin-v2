export const HintEditorMode = {
  Create: 'create',
  Edit: 'edit',
  Translate: 'translate',
  Delete: 'delete',
} as const;
export type HintEditorMode = (typeof HintEditorMode)[keyof typeof HintEditorMode];
