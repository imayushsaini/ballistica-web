import { Component, Inject, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModsService } from 'src/app/services/mods.service';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Banner } from 'src/app/models/model';
import { BannerModule } from 'src/app/shared/banner/banner.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
interface file {
  fileName: string;
  fileId: string;
}
@Component({
  selector: 'app-mod',
  templateUrl: './mod.component.html',
  styleUrls: ['./mod.component.scss'],
})
export class ModComponent implements OnInit, OnDestroy {
  banner: Banner;
  mod: any;
  isLoggedIn = false;
  isLoading = false;
  videos: file[] = [];
  scripts: file[] = [];
  images: file[] = [];
  imageUrls: SafeUrl[] = [];
  videoUrls: SafeUrl[] = [];
  private createdObjectUrls: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private modsService: ModsService,
    private activatedRoute: ActivatedRoute,
    private _seoService: SEOServiceService,
    private router: Router,
    public dialog: MatDialog,
    private tokenStorage: TokenStorageService,
    private workspace: WorkspaceService,
    private santizer: DomSanitizer,
  ) {
    this.banner = new Banner(
      'ca-pub-7561471327972639',
      5930666999,
      'auto',
      null,
      true,
    );
  }

  ngOnInit(): void {
    const modId = this.activatedRoute.snapshot.paramMap.get('modId');
    if (this.tokenStorage.getToken()) this.isLoggedIn = true;

    // Check if mod was passed directly in router state for instant zero-delay render
    const stateMod = (typeof history !== 'undefined' && history.state?.mod) ? history.state.mod : null;
    if (stateMod && (stateMod.messageId === modId || !modId)) {
      this.populateModData(stateMod);
    } else {
      this.loadData(modId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Prevent memory leaks by revoking created object URLs
    if (typeof window !== 'undefined') {
      for (const url of this.createdObjectUrls) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
      }
    }
    this.createdObjectUrls = [];
  }

  return() {
    const key = this.activatedRoute.snapshot.queryParamMap.get('q');
    const page = this.activatedRoute.snapshot.queryParamMap.get('page');
    const page_size = this.activatedRoute.snapshot.queryParamMap.get('size');
    this.router.navigate(['/mods'], {
      queryParams: { q: key, page: page, size: page_size },
    });
  }

  populateModData(modItem: any) {
    this.mod = [modItem];
    this.scripts = [];
    this.videos = [];
    this.images = [];
    this.imageUrls = [];
    this.videoUrls = [];

    var title = modItem.title || 'unknown.mod';
    for (var attach of modItem.attachments || []) {
      if (
        attach.fileName.endsWith('.py') ||
        attach.fileName.endsWith('.zip') ||
        attach.fileName.endsWith('.rar')
      ) {
        if (!modItem.title) title = attach.fileName;
        this.scripts.push(attach);
      } else if (attach.fileName.endsWith('.mp4')) {
        this.videos.push(attach);
      } else if (
        attach.fileName.endsWith('.jpg') ||
        attach.fileName.endsWith('.png') ||
        attach.fileName.endsWith('.jpeg') ||
        attach.fileName.endsWith('.gif')
      ) {
        this.images.push(attach);
      }
    }

    this.mod[0].title = title;
    this.updateMeta(this.mod[0]);

    for (var image of this.images) {
      this.loadMedia(image.fileId, 'image');
    }
    for (var video of this.videos) {
      this.loadMedia(video.fileId, 'video');
    }

    // Auto-open install dialog if redirected back from login
    const installFileName = this.activatedRoute.snapshot.queryParamMap.get('installFile');
    const installFileId = this.activatedRoute.snapshot.queryParamMap.get('fileId');
    if (installFileName || installFileId) {
      const targetScript =
        this.scripts.find(
          (s) =>
            (installFileId && s.fileId === installFileId) ||
            (installFileName && s.fileName === installFileName)
        ) ||
        (this.scripts.length > 0 ? this.scripts[0] : null);

      if (targetScript) {
        setTimeout(() => {
          this.openVerticallyCentered(targetScript);
        }, 200);
      }
    }
  }

  loadData(modId: any) {
    this.isLoading = true;
    this.modsService
      .getMods(1, 0, modId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = false;
          const rawMods = Array.isArray(data) ? data : data?.mods || [];
          if (!rawMods || rawMods.length === 0) return;
          this.populateModData(rawMods[0]);
        },
        error: (err) => {
          console.error('Error loading mod data:', err);
          this.isLoading = false;
        },
      });
  }

  loadMedia(fileId: string, type: string) {
    if (typeof window === 'undefined') return;
    this.modsService
      .downloadMod(fileId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          if (typeof window === 'undefined') return;
          const blob = new Blob([response], { type: response.type });
          const url = window.URL.createObjectURL(blob);
          this.createdObjectUrls.push(url);
          if (type == 'image') {
            this.imageUrls.push(this.santizer.bypassSecurityTrustUrl(url));
          } else if (type == 'video') {
            this.videoUrls.push(this.santizer.bypassSecurityTrustUrl(url));
          }
        },
        error: (err) => {
          console.error(`Error loading media ${fileId}:`, err);
        },
      });
  }

  updateMeta(meta: any) {
    var rt = this.getChild(this.activatedRoute);

    rt.data.subscribe((data: any) => {
      this._seoService.updateTitle(meta.title);
      this._seoService.updateOgUrl('https://bombsquad-community.web.app/');
      //Updating Description tag dynamically with title
      this._seoService.updateDescription(meta.description);
    });
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  openVerticallyCentered(file: file) {
    const modId = this.activatedRoute.snapshot.paramMap.get('modId') || '';
    const dialogRef = this.dialog.open(ModDialog, {
      data: { file: file, loggedIn: this.isLoggedIn, modId: modId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'mod-dialog.component',
  templateUrl: 'mod-dialog.component.html',
  styleUrls: ['./mod-dialog.component.scss'],
})
export class ModDialog {
  public file: any;
  public modId: string = '';
  selected = '';
  workspaces: any[] = [];
  loggedIn: boolean;
  validFile = false;
  haveWorkspace: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) data: { file: file; loggedIn: boolean; modId?: string },
    private modsService: ModsService,
    private workspace: WorkspaceService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<ModDialog>,
  ) {
    this.file = data.file;
    this.loggedIn = data.loggedIn;
    this.modId = data.modId || '';
    this.workspaces = workspace.getWorkspaceList() || [];
    if (this.workspaces.length > 0) {
      this.haveWorkspace = true;
      this.selected = this.workspaces[0].id || this.workspaces[0].name || this.workspaces[0];
    }
    if (this.file.fileName.endsWith('.py')) this.validFile = true;
  }
  config: MatSnackBarConfig = {
    duration: 5000,
  };

  goToLogin() {
    this.dialogRef.close();
    const returnUrl = `/mods/${this.modId}?installFile=${encodeURIComponent(this.file.fileName)}&fileId=${encodeURIComponent(this.file.fileId)}`;
    this.router.navigate(['/login'], { queryParams: { redirect: returnUrl } });
  }

  download() {
    this.modsService
      .downloadMod(this.file.fileId)
      .subscribe((response: Blob) => {
        const downloadLink = document.createElement('a');
        const blob = new Blob([response], { type: response.type });
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = this.file.fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);
      });
    this.snackBar.open('Downloading Started', '', this.config);
  }

  install() {
    const wsObj = this.workspaces.find((w: any) => w.id === this.selected || w.name === this.selected);
    const wsDisplayName = wsObj ? wsObj.name : this.selected;
    this.snackBar.open(
      `Installing mod ${this.file.fileName} to workspace "${wsDisplayName}"...`,
      '',
      this.config,
    );
    this.installMod(0);
  }
  installMod(retry: number) {
    this.workspace
      .installModToWorkspace(
        this.file.fileId,
        this.file.fileName,
        this.selected,
      )
      .subscribe({
        next: (response: any) => {
          if (response && (response.status === 200 || response.status === 204)) {
            this.snackBar.open(
              `Installation complete for ${this.file.fileName}`,
              '',
              this.config,
            );
          }
        },
        error: (error) => {
          console.error('Install mod error:', error);
          if (retry >= 2) {
            this.snackBar.open(`Installation FAILED: ${error?.message || 'Server error'}`, '', this.config);
          } else {
            this.installMod(retry + 1);
          }
        },
      });
  }
}

const routes: Routes = [{ path: '', component: ModComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BannerModule,
  ],
  exports: [ModComponent, ModDialog],
  declarations: [ModComponent, ModDialog],
  providers: [],
})
export class ModPageModule {}

