import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, firstValueFrom } from 'rxjs';
import { Workspace, WorkspaceFilesResponse } from '../models/model';
import { TokenStorageService } from './token-storage.service';
import { ModsService } from './mods.service';

const API_V2 = 'https://mods.69420555.xyz/v2';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  workspaces: Workspace[] = [];
  activeWorkspace: Workspace | null = null;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private modsService: ModsService,
  ) {
    if (this.tokenStorage.getToken()) {
      this.initializeWorkspace();
    }

    this.tokenStorage.loginEvent.subscribe(() => {
      if (this.tokenStorage.getToken()) {
        this.initializeWorkspace();
      } else {
        this.workspaces = [];
        this.activeWorkspace = null;
      }
    });
  }

  initializeWorkspace(): void {
    this.fetchWorkspaceList().subscribe({
      next: (data: any) => {
        if (data && data.workspaces) {
          this.workspaces = data.workspaces;
          this.verifyWorkspace();

          // If no active workspace is currently set, activate the first available workspace
          if (this.workspaces.length > 0 && !this.activeWorkspace) {
            this.activeWorkspace = this.workspaces[0];
            this.setActive(this.workspaces[0].id).subscribe({
              next: () => console.log(`Default active workspace set to "${this.workspaces[0].name}"`),
              error: () => {},
            });
          }
        }
      },
      error: (error) => {
        console.error('Failed to load workspaces:', error);
        this.workspaces = [];
      },
    });

    this.getActiveWorkspace().subscribe({
      next: (activeWs: any) => {
        if (activeWs) {
          this.activeWorkspace = activeWs;
        } else if (this.workspaces.length > 0 && !this.activeWorkspace) {
          this.activeWorkspace = this.workspaces[0];
        }
      },
      error: () => {},
    });
  }

  verifyWorkspace(): void {
    if (this.workspaces.length === 0 && this.tokenStorage.getToken()) {
      console.log('No workspace found under this account, creating "BCS MODS"...');
      this.createWorkspace('BCS MODS').subscribe({
        next: (createdWs: any) => {
          const wsId = createdWs?.id;
          if (wsId) {
            this.setActive(wsId).subscribe({
              next: () => {
                console.log('BCS MODS is now activated for this account');
                this.initializeWorkspace();
              },
            });
          }
        },
        error: (err) => console.error('Failed to auto-create workspace:', err),
      });
    }
  }

  /**
   * GET /v2/workspaces - List all workspaces
   */
  fetchWorkspaceList(): Observable<{ workspaces: Workspace[] }> {
    return this.http.get<{ workspaces: Workspace[] }>(`${API_V2}/workspaces`);
  }

  /**
   * Returns locally cached workspace list
   */
  getWorkspaceList(): Workspace[] {
    return this.workspaces;
  }

  /**
   * GET /v2/workspaces/active - Get active workspace metadata
   */
  getActiveWorkspace(): Observable<Workspace | null> {
    return this.http.get<Workspace | null>(`${API_V2}/workspaces/active`);
  }

  /**
   * POST /v2/workspaces/active - Set active workspace
   */
  setActive(workspaceId: string): Observable<any> {
    const ws = this.workspaces.find((w) => w.id === workspaceId || w.name === workspaceId);
    const targetId = ws ? ws.id : workspaceId;
    return this.http.post(`${API_V2}/workspaces/active`, { workspace_id: targetId });
  }

  /**
   * POST /v2/workspaces - Create a new workspace
   */
  createWorkspace(name: string): Observable<Workspace> {
    return this.http.post<Workspace>(`${API_V2}/workspaces`, { name: name });
  }

  /**
   * PATCH /v2/workspaces/{id} - Rename workspace
   */
  renameWorkspace(workspaceId: string, name: string): Observable<Workspace> {
    return this.http.patch<Workspace>(`${API_V2}/workspaces/${encodeURIComponent(workspaceId)}`, {
      name: name,
    });
  }

  /**
   * DELETE /v2/workspaces/{id} - Delete workspace
   */
  deleteWorkspace(workspaceId: string): Observable<any> {
    return this.http.delete(`${API_V2}/workspaces/${encodeURIComponent(workspaceId)}`);
  }

  /**
   * GET /v2/workspaces/{id} - Get single workspace metadata
   */
  getWorkspace(workspaceId: string): Observable<Workspace> {
    return this.http.get<Workspace>(`${API_V2}/workspaces/${encodeURIComponent(workspaceId)}`);
  }

  /**
   * POST /v2/workspaces/active - Deactivate syncing (set active to null)
   */
  deactivateWorkspace(): Observable<any> {
    this.activeWorkspace = null;
    return this.http.post(`${API_V2}/workspaces/active`, { workspace_id: null });
  }

  /**
   * GET /v2/workspaces/{id}/files - List files in workspace
   */
  getWorkspaceFiles(workspaceId: string): Observable<WorkspaceFilesResponse> {
    return this.http.get<WorkspaceFilesResponse>(
      `${API_V2}/workspaces/${encodeURIComponent(workspaceId)}/files`,
    );
  }

  /**
   * GET /v2/workspaces/{id}/files/{path} - Download raw file bytes
   */
  downloadWorkspaceFile(workspaceId: string, filePath: string): Observable<Blob> {
    return this.http.get(
      `${API_V2}/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(filePath)}`,
      { responseType: 'blob' },
    );
  }

  /**
   * POST /v2/workspaces/{id}/files/{path} with {"op": "mkdir"} - Create directory
   */
  createDirectory(workspaceId: string, dirPath: string): Observable<any> {
    return this.http.post(
      `${API_V2}/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(dirPath)}`,
      { op: 'mkdir' },
    );
  }

  /**
   * POST /v2/workspaces/{id}/files/{path} with {"op": "move", "dest": "..."} - Move or rename
   */
  moveFile(workspaceId: string, sourcePath: string, destPath: string): Observable<any> {
    return this.http.post(
      `${API_V2}/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(sourcePath)}`,
      { op: 'move', dest: destPath },
    );
  }

  /**
   * POST /v2/workspaces/{id}/files/{path} with {"op": "copy", "dest": "..."} - Copy file or folder
   */
  copyFile(workspaceId: string, sourcePath: string, destPath: string): Observable<any> {
    return this.http.post(
      `${API_V2}/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(sourcePath)}`,
      { op: 'copy', dest: destPath },
    );
  }

  /**
   * DELETE /v2/workspaces/{id}/files/{path} - Delete file or directory
   */
  deleteWorkspaceFile(workspaceId: string, filePath: string): Observable<any> {
    return this.http.delete(
      `${API_V2}/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(filePath)}`,
    );
  }

  /**
   * Uploads file to workspace at specific path
   */
  uploadFile(
    workspaceId: string,
    filePath: string,
    content: Blob | File | ArrayBuffer,
  ): Observable<{ status: number; message: string }> {
    return from(this.installRawContentToWorkspaceAsync(content, filePath, workspaceId));
  }

  /**
   * Installs raw mod file content (Blob or ArrayBuffer) into a workspace
   */
  async installRawContentToWorkspaceAsync(
    content: Blob | ArrayBuffer,
    fileName: string,
    workspaceIdOrName?: string,
  ): Promise<{ status: number; message: string }> {
    let ws = this.workspaces.find(
      (w) => w.id === workspaceIdOrName || w.name === workspaceIdOrName,
    );

    let workspaceId = ws ? ws.id : (workspaceIdOrName || this.activeWorkspace?.id || this.workspaces[0]?.id);

    // Auto-create workspace if none exists
    if (!workspaceId && this.tokenStorage.getToken()) {
      const createdWs: any = await firstValueFrom(this.createWorkspace('BCS MODS'));
      if (createdWs?.id) {
        workspaceId = createdWs.id;
        await firstValueFrom(this.setActive(workspaceId));
        this.initializeWorkspace();
      }
    }

    if (!workspaceId) {
      throw new Error('No workspace found. Please log in or create a workspace first.');
    }

    // 1. Convert content to ArrayBuffer
    const arrayBuffer = content instanceof ArrayBuffer ? content : await content.arrayBuffer();
    const size = arrayBuffer.byteLength;

    // 2. Compute SHA-256 hash
    let sha256 = '';
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      sha256 = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } else {
      throw new Error('Web Cryptography API is not available in this environment.');
    }

    const cleanFileName = fileName.replace(/^.*[\\\/]/, '');

    // 3. Initiate upload with Ballistica V2 API
    const initRes: any = await firstValueFrom(
      this.http.post(
        `${API_V2}/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(cleanFileName)}`,
        {
          op: 'upload-init',
          size: size,
          sha256: sha256,
        },
      ),
    );

    // If file already exists in Ballistica dedup store, it's instantly linked
    if (initRes && initRes.status === 'exists') {
      return { status: 200, message: 'Installed successfully' };
    }

    // 4. Upload file content directly if required
    if (initRes && initRes.status === 'upload_required') {
      const uploadUrl = initRes.upload_url;
      const headers = initRes.upload_headers || {
        'Content-Type': 'application/octet-stream',
      };

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: headers,
        body: arrayBuffer,
      });

      if (!uploadRes.ok) {
        throw new Error(`Failed to upload file content: ${uploadRes.statusText}`);
      }

      // 5. Finalize upload
      await firstValueFrom(
        this.http.post(
          `${API_V2}/workspaces/${encodeURIComponent(workspaceId)}/files/${encodeURIComponent(cleanFileName)}`,
          {
            op: 'upload-finalize',
            session_id: initRes.session_id,
          },
        ),
      );

      return { status: 200, message: 'Installed successfully' };
    }

    return { status: 200, message: 'Installed successfully' };
  }

  installRawContentToWorkspace(
    content: Blob | ArrayBuffer,
    fileName: string,
    workspaceIdOrName?: string,
  ): Observable<{ status: number; message: string }> {
    return from(this.installRawContentToWorkspaceAsync(content, fileName, workspaceIdOrName));
  }

  /**
   * Installs a mod file by ID into a workspace following Ballistica V2 file upload protocol
   */
  installModToWorkspace(
    fileId: string,
    fileName: string,
    workspaceIdOrName: string,
  ): Observable<{ status: number; message: string }> {
    return from(this.installModToWorkspaceAsync(fileId, fileName, workspaceIdOrName));
  }

  private async installModToWorkspaceAsync(
    fileId: string,
    fileName: string,
    workspaceIdOrName: string,
  ): Promise<{ status: number; message: string }> {
    const blob = await firstValueFrom(this.modsService.downloadMod(fileId));
    return this.installRawContentToWorkspaceAsync(blob, fileName, workspaceIdOrName);
  }
}

