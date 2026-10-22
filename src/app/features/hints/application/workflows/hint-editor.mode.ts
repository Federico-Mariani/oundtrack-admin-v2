export const HintEditorMode = {
  Create: 'create',
  Edit: 'edit',
  Translate: 'translate',
  Delete: 'delete',
  Image: 'image',
} as const;
export type HintEditorMode = (typeof HintEditorMode)[keyof typeof HintEditorMode];
