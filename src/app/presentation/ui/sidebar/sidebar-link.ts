/** Declarative destination supplied by the layout, never a feature lookup in the renderer. */
export interface SidebarLink {
  readonly id: string;
  readonly labelKey: string;
  readonly icon?: string;
  readonly commands: ReadonlyArray<string | number>;
  readonly exact?: boolean;
}
