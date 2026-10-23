export interface ActionMenuItem {
  readonly value: string;
  readonly label: string;
  readonly destructive?: boolean;
  readonly disabled?: boolean;
}
