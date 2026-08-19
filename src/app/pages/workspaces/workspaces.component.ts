import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { WorkspaceService } from 'src/app/services/workspace.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { Workspace, WorkspaceFile } from 'src/app/models/model';
import { BannerModule } from 'src/app/shared/banner/banner.component';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.scss'],
})
export class WorkspacesComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isLoggedIn = false;
  isLoadingWorkspaces = false;
  isLoadingFiles = false;
  isActionRunning = false;

  workspaces: Workspace[] = [];
  activeWorkspace: Workspace | null = null;
  selectedWorkspace: Workspace | null = null;

  files: WorkspaceFile[] = [];
  searchQuery: string = '';
  isDraggingOver = false;

  // Modals state
  showCreateWsModal = false;
  newWsName = '';

  showRenameWsModal = false;
  renameWsName = '';
  targetWsToRename: Workspace | null = null;

  showMkdirModal = false;
  newDirName = '';

  showMoveFileModal = false;
  targetFileToMove: WorkspaceFile | null = null;
  newFilePath = '';

  private snackConfig: MatSnackBarConfig = {
    duration: 3500,
    verticalPosition: 'bottom',
    horizontalPosition: 'right',
  };

  constructor(
    private workspaceService: WorkspaceService,
    private tokenStorage: TokenStorageService,
    private seoService: SEOServiceService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.seoService.updateTitle('Manage Ballistica Workspaces | BombSquad Community');
    this.seoService.updateDescription(
      'Manage Ballistica cloud workspaces, sync game mods, upload Python plugins, browse workspace files, and organize BombSquad scripts.',
    );
    this.seoService.updateOgUrl('https://bombsquad-community.web.app/workspaces');

    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {
      this.loadWorkspaces();
    }

    this.tokenStorage.loginEvent.subscribe(() => {
      this.isLoggedIn = !!this.tokenStorage.getToken();
      if (this.isLoggedIn) {
        this.loadWorkspaces();
      } else {
        this.workspaces = [];
        this.activeWorkspace = null;
        this.selectedWorkspace = null;
        this.files = [];
      }
    });
  }

  loadWorkspaces(autoSelectId?: string): void {
    this.isLoadingWorkspaces = true;
    this.workspaceService.fetchWorkspaceList().subscribe({
      next: (res: any) => {
        this.isLoadingWorkspaces = false;
        this.workspaces = res?.workspaces || [];

        // Check active workspace
        this.workspaceService.getActiveWorkspace().subscribe({
          next: (activeWs) => {
            this.activeWorkspace = activeWs;
            this.workspaceService.activeWorkspace = activeWs;

            // Auto-select workspace
            if (autoSelectId) {
              this.selectedWorkspace =
                this.workspaces.find((w) => w.id === autoSelectId) || this.workspaces[0] || null;
            } else if (!this.selectedWorkspace && this.workspaces.length > 0) {
              this.selectedWorkspace =
                this.workspaces.find((w) => w.id === this.activeWorkspace?.id) ||
                this.workspaces[0];
            } else if (this.selectedWorkspace) {
              this.selectedWorkspace =
                this.workspaces.find((w) => w.id === this.selectedWorkspace?.id) ||
                this.workspaces[0] ||
                null;
            }

            if (this.selectedWorkspace) {
              this.loadFiles(this.selectedWorkspace.id);
            }
          },
          error: () => {
            if (this.workspaces.length > 0 && !this.selectedWorkspace) {
              this.selectedWorkspace = this.workspaces[0];
              this.loadFiles(this.selectedWorkspace.id);
            }
          },
        });
      },
      error: (err) => {
        this.isLoadingWorkspaces = false;
        console.error('Failed to load workspaces:', err);
        this.snackBar.open('Failed to load workspaces.', '', this.snackConfig);
      },
    });
  }

  selectWorkspace(ws: Workspace): void {
    this.selectedWorkspace = ws;
    this.loadFiles(ws.id);
  }

  loadFiles(workspaceId: string): void {
    this.isLoadingFiles = true;
    this.workspaceService.getWorkspaceFiles(workspaceId).subscribe({
      next: (res: any) => {
        this.isLoadingFiles = false;
        this.files = res?.files || res?.entries || [];
      },
      error: (err) => {
        this.isLoadingFiles = false;
        console.error('Failed to load workspace files:', err);
        this.snackBar.open('Failed to load files for this workspace.', '', this.snackConfig);
      },
    });
  }

  get filteredFiles(): WorkspaceFile[] {
    if (!this.searchQuery || !this.searchQuery.trim()) {
      return this.files;
    }
    const q = this.searchQuery.toLowerCase().trim();
    return this.files.filter((f) => f.path.toLowerCase().includes(q));
  }

  // --- Workspace Actions ---

  openCreateWsModal(): void {
    this.newWsName = '';
    this.showCreateWsModal = true;
  }

  createWorkspace(): void {
    if (!this.newWsName || !this.newWsName.trim()) return;
    const name = this.newWsName.trim();
    this.isActionRunning = true;

    this.workspaceService.createWorkspace(name).subscribe({
      next: (created: any) => {
        this.isActionRunning = false;
        this.showCreateWsModal = false;
        this.snackBar.open(`Workspace "${name}" created successfully!`, '', this.snackConfig);
        this.loadWorkspaces(created?.id);
      },
      error: (err) => {
        this.isActionRunning = false;
        console.error('Create workspace error:', err);
        this.snackBar.open(`Failed to create workspace: ${err?.message || 'Error'}`, '', this.snackConfig);
      },
    });
  }

  openRenameWsModal(ws: Workspace, event?: Event): void {
    if (event) event.stopPropagation();
    this.targetWsToRename = ws;
    this.renameWsName = ws.name;
    this.showRenameWsModal = true;
  }

  renameWorkspace(): void {
    if (!this.targetWsToRename || !this.renameWsName || !this.renameWsName.trim()) return;
    const newName = this.renameWsName.trim();
    const wsId = this.targetWsToRename.id;
    this.isActionRunning = true;

    this.workspaceService.renameWorkspace(wsId, newName).subscribe({
      next: () => {
        this.isActionRunning = false;
        this.showRenameWsModal = false;
        this.snackBar.open(`Workspace renamed to "${newName}"`, '', this.snackConfig);
        this.loadWorkspaces(wsId);
      },
      error: (err) => {
        this.isActionRunning = false;
        console.error('Rename workspace error:', err);
        this.snackBar.open(`Failed to rename workspace: ${err?.message || 'Error'}`, '', this.snackConfig);
      },
    });
  }

  deleteWorkspace(ws: Workspace, event?: Event): void {
    if (event) event.stopPropagation();
    if (!confirm(`Are you sure you want to delete workspace "${ws.name}"? (A 30-day backup is preserved on server)`)) {
      return;
    }
    this.isActionRunning = true;

    this.workspaceService.deleteWorkspace(ws.id).subscribe({
      next: () => {
        this.isActionRunning = false;
        this.snackBar.open(`Workspace "${ws.name}" deleted`, '', this.snackConfig);
        if (this.selectedWorkspace?.id === ws.id) {
          this.selectedWorkspace = null;
          this.files = [];
        }
        this.loadWorkspaces();
      },
      error: (err) => {
        this.isActionRunning = false;
        console.error('Delete workspace error:', err);
        this.snackBar.open(`Failed to delete workspace: ${err?.message || 'Error'}`, '', this.snackConfig);
      },
    });
  }

  setActive(ws: Workspace, event?: Event): void {
    if (event) event.stopPropagation();
    this.isActionRunning = true;

    this.workspaceService.setActive(ws.id).subscribe({
      next: () => {
        this.isActionRunning = false;
        this.activeWorkspace = ws;
        this.workspaceService.activeWorkspace = ws;
        this.snackBar.open(`"${ws.name}" is now the active sync workspace!`, '', this.snackConfig);
      },
      error: (err) => {
        this.isActionRunning = false;
        console.error('Set active error:', err);
        this.snackBar.open(`Failed to set active workspace: ${err?.message || 'Error'}`, '', this.snackConfig);
      },
    });
  }

  deactivateActive(event?: Event): void {
    if (event) event.stopPropagation();
    this.isActionRunning = true;

    this.workspaceService.deactivateWorkspace().subscribe({
      next: () => {
        this.isActionRunning = false;
        this.activeWorkspace = null;
        this.snackBar.open('Workspace syncing disabled.', '', this.snackConfig);
      },
      error: (err) => {
        this.isActionRunning = false;
        console.error('Deactivate error:', err);
        this.snackBar.open('Failed to deactivate workspace.', '', this.snackConfig);
      },
    });
  }

  // --- File Actions ---

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.uploadSelectedFiles(Array.from(files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      this.uploadSelectedFiles(Array.from(event.dataTransfer.files));
    }
  }

  async uploadSelectedFiles(files: File[]): Promise<void> {
    if (!this.selectedWorkspace) return;
    const wsId = this.selectedWorkspace.id;

    for (const file of files) {
      this.snackBar.open(`Uploading ${file.name}...`, '', this.snackConfig);
      try {
        await this.workspaceService.installRawContentToWorkspaceAsync(file, file.name, wsId);
        this.snackBar.open(`Uploaded ${file.name} successfully!`, '', this.snackConfig);
      } catch (err: any) {
        console.error('Upload error for', file.name, err);
        this.snackBar.open(`Upload failed for ${file.name}: ${err?.message || 'Error'}`, '', this.snackConfig);
      }
    }
    this.loadFiles(wsId);
  }

  openMkdirModal(): void {
    this.newDirName = '';
    this.showMkdirModal = true;
  }

  createDirectory(): void {
    if (!this.selectedWorkspace || !this.newDirName || !this.newDirName.trim()) return;
    const dir = this.newDirName.trim();
    const wsId = this.selectedWorkspace.id;
    this.isActionRunning = true;

    this.workspaceService.createDirectory(wsId, dir).subscribe({
      next: () => {
        this.isActionRunning = false;
        this.showMkdirModal = false;
        this.snackBar.open(`Folder "${dir}" created successfully`, '', this.snackConfig);
        this.loadFiles(wsId);
      },
      error: (err) => {
        this.isActionRunning = false;
        console.error('Mkdir error:', err);
        this.snackBar.open(`Failed to create directory: ${err?.message || 'Error'}`, '', this.snackConfig);
      },
    });
  }

  downloadFile(file: WorkspaceFile): void {
    if (!this.selectedWorkspace) return;
    this.snackBar.open(`Downloading ${file.path}...`, '', this.snackConfig);

    this.workspaceService.downloadWorkspaceFile(this.selectedWorkspace.id, file.path).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.path.split('/').pop() || file.path;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download file error:', err);
        this.snackBar.open(`Download failed: ${err?.message || 'Error'}`, '', this.snackConfig);
      },
    });
  }

  openMoveFileModal(file: WorkspaceFile): void {
    this.targetFileToMove = file;
    this.newFilePath = file.path;
    this.showMoveFileModal = true;
  }

  moveFile(): void {
    if (!this.selectedWorkspace || !this.targetFileToMove || !this.newFilePath || !this.newFilePath.trim()) return;
    const oldPath = this.targetFileToMove.path;
    const newPath = this.newFilePath.trim();
    if (oldPath === newPath) {
      this.showMoveFileModal = false;
      return;
    }
    const wsId = this.selectedWorkspace.id;
    this.isActionRunning = true;

    this.workspaceService.moveFile(wsId, oldPath, newPath).subscribe({
      next: () => {
        this.isActionRunning = false;
        this.showMoveFileModal = false;
        this.snackBar.open(`Renamed/Moved to "${newPath}"`, '', this.snackConfig);
        this.loadFiles(wsId);
      },
      error: (err) => {
        this.isActionRunning = false;
        console.error('Move file error:', err);
        this.snackBar.open(`Failed to move file: ${err?.message || 'Error'}`, '', this.snackConfig);
      },
    });
  }

  copyFile(file: WorkspaceFile): void {
    if (!this.selectedWorkspace) return;
    const oldPath = file.path;
    const parts = oldPath.split('.');
    const ext = parts.length > 1 ? '.' + parts.pop() : '';
    const base = parts.join('.');
    const destPath = `${base}_copy${ext}`;

    this.isActionRunning = true;
    this.workspaceService.copyFile(this.selectedWorkspace.id, oldPath, destPath).subscribe({
      next: () => {
        this.isActionRunning = false;
        this.snackBar.open(`Copied to "${destPath}"`, '', this.snackConfig);
        this.loadFiles(this.selectedWorkspace!.id);
      },
      error: (err) => {
        this.isActionRunning = false;
        console.error('Copy file error:', err);
        this.snackBar.open(`Failed to copy file: ${err?.message || 'Error'}`, '', this.snackConfig);
      },
    });
  }

  deleteFile(file: WorkspaceFile): void {
    if (!this.selectedWorkspace) return;
    if (!confirm(`Are you sure you want to delete "${file.path}"?`)) return;

    this.isActionRunning = true;
    this.workspaceService.deleteWorkspaceFile(this.selectedWorkspace.id, file.path).subscribe({
      next: () => {
        this.isActionRunning = false;
        this.snackBar.open(`Deleted "${file.path}"`, '', this.snackConfig);
        this.loadFiles(this.selectedWorkspace!.id);
      },
      error: (err) => {
        this.isActionRunning = false;
        console.error('Delete file error:', err);
        this.snackBar.open(`Failed to delete file: ${err?.message || 'Error'}`, '', this.snackConfig);
      },
    });
  }

  // --- Helper formatters ---

  formatSize(bytes?: number | null): string {
    if (bytes === undefined || bytes === null) return '-';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getFileIcon(path: string, type?: string): string {
    if (type === 'dir' || path.endsWith('/')) return 'folder';
    if (path.endsWith('.py')) return 'code';
    if (path.endsWith('.json') || path.endsWith('.yaml') || path.endsWith('.toml')) return 'settings';
    if (path.endsWith('.zip') || path.endsWith('.rar') || path.endsWith('.tar.gz')) return 'archive';
    if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.webp')) return 'image';
    if (path.endsWith('.mp4') || path.endsWith('.webm')) return 'movie';
    return 'insert_drive_file';
  }

  goToLogin(): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/workspaces' } });
  }
}

const routes: Routes = [{ path: '', component: WorkspacesComponent }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    BannerModule,
  ],
  exports: [WorkspacesComponent],
  declarations: [WorkspacesComponent],
  providers: [],
})
export class WorkspacesModule {}
