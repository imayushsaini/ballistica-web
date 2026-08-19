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
        }
      },
      error: (error) => {
        console.error('Failed to load workspaces:', error);
        this.workspaces = [];
      },
    });

    this.getActiveWorkspace().subscribe({
      next: (activeWs: any) => {
        this.activeWorkspace = activeWs;
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
   * GET /v2/workspaces/{id}/files - List files in workspace
   */
  getWorkspaceFiles(workspaceId: string): Observable<WorkspaceFilesResponse> {
    return this.http.get<WorkspaceFilesResponse>(
      `${API_V2}/workspaces/${encodeURIComponent(workspaceId)}/files`,
    );
  }

  /**
   * Installs a mod file into a workspace following Ballistica V2 file upload protocol
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
    const ws = this.workspaces.find(
      (w) => w.id === workspaceIdOrName || w.name === workspaceIdOrName,
    );
    const workspaceId = ws ? ws.id : workspaceIdOrName;

    if (!workspaceId) {
      throw new Error('No valid workspace selected.');
    }

    // 1. Download mod file content
    const blob = await firstValueFrom(this.modsService.downloadMod(fileId));
    const arrayBuffer = await blob.arrayBuffer();
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
      return { status: 200, message: 'Mod installed successfully' };
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
        throw new Error(`Failed to upload mod content: ${uploadRes.statusText}`);
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

      return { status: 200, message: 'Mod installed successfully' };
    }

    return { status: 200, message: 'Mod installed successfully' };
  }
}

