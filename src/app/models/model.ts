export class Banner {
  constructor(
    public adClient: string,
    public adSlot: number,
    public adFormat: string,
    public layout_key: string | any,
    public fullWidthResponsive: boolean,
  ) {
    this.adClient = adClient;
    this.adSlot = adSlot;
    this.adFormat = adFormat || 'auto';
    this.layout_key = layout_key;
    this.fullWidthResponsive = fullWidthResponsive || true;
  }
}

export interface V2User {
  id: string;
  tag: string;
  create_time?: string;
  last_active_day?: string | null;
  total_active_days?: number;
}

export interface V2LoginResponse {
  success: boolean;
  token: string;
  user: V2User;
}

export interface Workspace {
  id: string;
  name: string;
  size: number;
  create_time: string;
  modified_time: string;
}

export interface WorkspaceFileEntry {
  path: string;
  type?: 'file' | 'directory' | 'dir' | string;
  size?: number | null;
  modified_time?: string | null;
}

export type WorkspaceFile = WorkspaceFileEntry;

export interface WorkspaceFilesResponse {
  entries?: WorkspaceFileEntry[];
  files?: WorkspaceFileEntry[];
}

