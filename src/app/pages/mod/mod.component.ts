import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';

import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModsService } from 'src/app/services/mods.service';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule} from '@angular/material/select'
import { MatChipsModule} from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Banner } from 'src/app/models/model';
import { BannerModule } from 'src/app/shared/banner/banner.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
interface file {
  fileName: string,
  fileId: string
}
@Component({
  selector: 'app-mod',
  templateUrl: './mod.component.html',
  styleUrls: ['./mod.component.scss']
})
export class ModComponent implements OnInit {
  banner: Banner;
  constructor(private modsService: ModsService,
    private activatedRoute: ActivatedRoute,
    private _seoService: SEOServiceService,
    private router: Router,
    public dialog: MatDialog,
    private tokenStorage: TokenStorageService,
    private workspace:WorkspaceService,
  private santizer: DomSanitizer) {
     this.banner = new Banner(
      'ca-pub-7561471327972639',
      5930666999,
       'auto',
      null,
      true
      )
  }

  mod:any;
  isLoggedIn = false;
  videos:file[]=[];
  scripts:file[]=[];
  images: file[] = [];
  imageUrls: SafeUrl[] = [];
  videoUrls: SafeUrl[] = [];
  ngOnInit(): void {
    var modId=this.activatedRoute.snapshot.paramMap.get('modId');
    this.loadData(modId);
    if(this.tokenStorage.getToken()) this.isLoggedIn = true;
  }

  return() {
    const key = this.activatedRoute.snapshot.queryParamMap.get('q');
    const page = this.activatedRoute.snapshot.queryParamMap.get('page');
    const page_size = this.activatedRoute.snapshot.queryParamMap.get('size');
    this.router.navigate(['/mods'], {queryParams:{q:key,page:page,size:page_size}});

  }
  loadData(modId:any) {
    this.modsService.getMods(1,0,modId).subscribe((data:any)=>{
      this.mod=data;

        var title="unknown.mod"
        for(var attach of this.mod[0].attachments ){
          if(attach.fileName.endsWith(".py") || attach.fileName.endsWith(".zip") || attach.fileName.endsWith(".rar")){
            title = attach.fileName
            this.scripts.push(attach);
          }
          else if(attach.fileName.endsWith(".mp4")){
            this.videos.push(attach);
          }
          else if(attach.fileName.endsWith(".jpg")||attach.fileName.endsWith(".png")||attach.fileName.endsWith(".jpeg")||attach.fileName.endsWith(".gif")) {
            this.images.push(attach);
          }
        }

        this.mod[0].title=title;
      this.updateMeta(this.mod[0])
      for (var image of this.images) {
        this.loadMedia(image.fileId, "image");
      }
      for (var video of this.videos) {
        this.loadMedia(video.fileId, "video");
      }
    })
  }

  loadMedia(fileId: string, type: string) {
    this.modsService.downloadMod(fileId).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: response.type });
      const url = window.URL.createObjectURL(blob);
      if (type == "image") {
        this.imageUrls.push(this.santizer.bypassSecurityTrustUrl(url));
      } else if (type == "video") {
         this.videoUrls.push(this.santizer.bypassSecurityTrustUrl(url));
      }
    })

  }
  updateMeta(meta:any){
        var rt = this.getChild(this.activatedRoute)

        rt.data.subscribe((data: any) => {

          this._seoService.updateTitle(meta.title);
          this._seoService.updateOgUrl("https://bombsquad-community.web.app/");
          //Updating Description tag dynamically with title
          this._seoService.updateDescription(meta.description)
        });
  }

  getChild(activatedRoute: ActivatedRoute):any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  openVerticallyCentered(file: file) {
    const dialogRef = this.dialog.open(ModDialog, {
      data : { file:file ,loggedIn:this.isLoggedIn}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'mod-dialog.component',
  templateUrl: 'mod-dialog.component.html',
})
export class ModDialog{
  public file : any;
  selected = "";
  workspaces:any;
  loggedIn:boolean;
  validFile=false;
  haveWorkspace:boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) data : {file : file, loggedIn:boolean},private modsService: ModsService, private workspace:WorkspaceService, private snackBar: MatSnackBar) {

    this.file = data.file;
    this.loggedIn = data.loggedIn;
    this.workspaces = workspace.getWorkspaceList();
    // this.selected = this.workspaces[0];
    if(this.workspaces.length>0){
      this.haveWorkspace=true;
    }
    if(this.file.fileName.endsWith(".py"))
     this.validFile=true;

  }
  config: MatSnackBarConfig = {
    duration: 5000
  }

  download() {
    this.modsService.downloadMod(this.file.fileId).subscribe((response: Blob) => {
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
    this.snackBar.open("Downloading Started",'',this.config)
  }

  install() {
    this.snackBar.open(`Installing mod ${this.file.fileName} to workspace ${this.selected}`,'',this.config)
    this.installMod(0);
  }
  installMod(retry:number) {
    this.workspace.installModToWorkspace(this.file.fileId, this.file.fileName, this.selected,).subscribe(response =>{
        if(response.status==200) {
          this.snackBar.open(`Installation done for ${this.file.fileName}`,'',this.config)
        }
    },(error)=> {
      if(retry>=3){
        this.snackBar.open(`Installation FAILED  :( `,'',this.config)
      }else this.installMod(retry+1)
    })
  }

}


const routes: Routes = [{path: '', component: ModComponent}];

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
    BannerModule,
    ],
  exports: [ModComponent, ModDialog],
  declarations: [ModComponent, ModDialog],
  providers: []
})
export class ModPageModule {
}
