import type { PageRequest } from '@shared/types/pagination/page-request';
/** Controlled server state. DataTable emits intentions and never performs HTTP requests. */
export interface DataTableRemoteState extends PageRequest {
  readonly total: number;
  readonly search: string;
  readonly filtered: boolean;
}
