import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BannerModule } from 'src/app/shared/banner/banner.component';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Workspace } from 'src/app/models/model';

@Component({
  selector: 'app-pluginmanager',
  templateUrl: './pluginmanager.html',
  styleUrls: ['./pluginmanager.scss'],
})
export class PluginManager implements OnInit {
  downloadLink =
    'https://raw.githubusercontent.com/bombsquad-community/plugin-manager/main/plugin_manager.py';

  isLoggedIn = false;
  isInstalling = false;
  workspaces: Workspace[] = [];
  selectedWorkspace: string = '';

  private config: MatSnackBarConfig = {
    duration: 3500,
    verticalPosition: 'bottom',
    horizontalPosition: 'right',
  };

  constructor(
    private http: HttpClient,
    private _seoService: SEOServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService,
    private tokenStorage: TokenStorageService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.loadWorkspaces();
    }

    this.tokenStorage.loginEvent.subscribe(() => {
      this.isLoggedIn = !!this.tokenStorage.getToken();
      if (this.isLoggedIn) {
        this.loadWorkspaces();
      } else {
        this.workspaces = [];
        this.selectedWorkspace = '';
      }
    });

    var rt = this.getChild(this.activatedRoute);
    rt.data.subscribe((data: any) => {
      this._seoService.updateTitle(data.title);
      this._seoService.updateOgUrl(data.ogUrl);
      this._seoService.updateDescription(data.description);
    });
  }

  loadWorkspaces(): void {
    this.workspaceService.fetchWorkspaceList().subscribe({
      next: (res: any) => {
        if (res && res.workspaces) {
          this.workspaces = res.workspaces;
          if (this.workspaces.length > 0) {
            const active = this.workspaceService.activeWorkspace;
            this.selectedWorkspace = active?.id || this.workspaces[0].id;
          }
        }
      },
      error: (err) => {
        console.error('Error fetching workspaces:', err);
      },
    });
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  async onDownload() {
    this.snackBar.open('Starting download for plugin_manager.py...', '', this.config);
    try {
      // Use direct fetch with no-cors / standard CORS to download blob
      const res = await fetch(this.downloadLink, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plugin_manager.py';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.snackBar.open('plugin_manager.py downloaded successfully!', '', this.config);
    } catch (err) {
      console.warn('Fetch download failed, attempting direct link navigation:', err);
      // Fallback: direct window open / anchor download
      const a = document.createElement('a');
      a.href = this.downloadLink;
      a.target = '_blank';
      a.download = 'plugin_manager.py';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.snackBar.open('Download started in new tab.', '', this.config);
    }
  }

  async installToWorkspace() {
    this.isInstalling = true;
    const wsObj = this.workspaces.find(
      (w) => w.id === this.selectedWorkspace || w.name === this.selectedWorkspace,
    );
    const wsName = wsObj ? wsObj.name : this.selectedWorkspace || 'workspace';

    this.snackBar.open(`Installing Plugin Manager to "${wsName}"...`, '', this.config);

    try {
      const fetchRes = await fetch(this.downloadLink);
      if (!fetchRes.ok) throw new Error(`Failed to fetch script: HTTP ${fetchRes.status}`);
      const blob = await fetchRes.blob();

      this.workspaceService
        .installRawContentToWorkspace(blob, 'plugin_manager.py', this.selectedWorkspace)
        .subscribe({
          next: () => {
            this.isInstalling = false;
            this.snackBar.open('Plugin Manager installed successfully!', '', this.config);
          },
          error: (err: any) => {
            this.isInstalling = false;
            console.error('Workspace install error:', err);
            this.snackBar.open(
              `Installation failed: ${err?.message || 'Server error'}`,
              '',
              this.config,
            );
          },
        });
    } catch (err: any) {
      this.isInstalling = false;
      console.error('Failed to fetch plugin_manager.py:', err);
      this.snackBar.open(`Failed to load plugin_manager.py: ${err?.message || 'Network error'}`, '', this.config);
    }
  }

  goToLogin() {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/pluginmanager' },
    });
  }
}

const routes: Routes = [{ path: '', component: PluginManager }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    BannerModule,
  ],
  exports: [PluginManager],
  declarations: [PluginManager],
  providers: [],
})
export class PluginManagerModule {}
