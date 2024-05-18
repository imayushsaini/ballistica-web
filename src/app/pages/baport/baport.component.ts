import {
  AfterViewInit,
  Component,
  ElementRef,
  NgModule,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import * as ace from 'ace-builds';
import { DragDropFileUploadDirective } from './drag-drop-upload.directive';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-baport',
  templateUrl: './baport.component.html',
  styleUrl: './baport.component.scss',
})
export class BaportComponent implements OnInit, AfterViewInit {
  appLaunched: boolean = false;
  aceEditor: any;
  fileType: string | undefined;
  fileName: string = "myPlugin.py";
  files: any[] = [];
  mulitfilewarning = false;
  insertedByUs = false;
  portSnackBarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;
  @ViewChild('editor', { static: false })
  private editor!: ElementRef<HTMLElement>;

  constructor(
    private _seoService: SEOServiceService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private _snackBar: MatSnackBar,
  ) {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    var rt = this.getChild(this.activatedRoute);

    rt.data.subscribe((data: any) => {
      this._seoService.updateTitle(data.title);
      this._seoService.updateOgUrl(data.ogUrl);
      this._seoService.updateDescription(data.description);
    });
  }
  initAce(): void {
    console.log('after view init');
    ace.config.set('fontSize', '14px');
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.10.0/src-noconflict',
    );

    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.session.setValue('print("hello world")');
    this.aceEditor.setTheme('ace/theme/twilight');
    this.aceEditor.session.setMode('ace/mode/python');
    this.aceEditor.setOption('minLines', 34);
    this.aceEditor.setOption('maxLines', 50);
    this.aceEditor.session.on('change', (delta: any) => {
      if (delta.action == 'insert') {
        if (this.insertedByUs) {
          this.insertedByUs = false;
          let snackBarRef = this._snackBar.open(
            'Download updated code',
            'Download',
          );
          snackBarRef.onAction().subscribe(() => this.downloadScript());
        } else {
          // this.updateScript();
          if (this.portSnackBarRef == null) {
            this.portSnackBarRef = this._snackBar.open(
              'Update code to latest API',
              'Update',
            );
            this.portSnackBarRef
              .onAction()
              .subscribe(() => this.updateScript());
            this.portSnackBarRef.afterDismissed().subscribe(() => {
              this.portSnackBarRef = null;
            });
          }
        }
      }
    });

    const script = this.renderer.createElement('script');
    script.src = 'assets/api7to8.js';
    this.renderer.appendChild(document.body, script);
  }
  callBaPortConvert(input: string) {
    if (typeof (window as any).convert === 'function') {
      return (window as any).convert(input);
    }
    return 'Faield to load baport converter';
  }
  downloadScript() {
    const blob = new Blob([this.aceEditor.getValue()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  updateScript() {
    let code = this.aceEditor.getValue();
    let ported = this.callBaPortConvert(code);
    this.insertedByUs = true;
    this.aceEditor.session.setValue(ported, -1);
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  launch() {
    this.appLaunched = true;
    setTimeout(() => this.initAce(), 100);
  }

  async onFileDropped($event: any) {
    if ($event.length > 1) {
      this.mulitfilewarning = true;
    }
    for (const item of $event) {
      console.log(item);
      this.files.push(item);
    }
    this.fileName = this.files[0].name;
    this.aceEditor.session.setValue(await this.files[0].text());
  }
}

const routes: Routes = [{ path: '', component: BaportComponent }];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatRippleModule,
    MatSnackBarModule,
    RouterModule.forChild(routes),
  ],
  exports: [BaportComponent],
  declarations: [BaportComponent, DragDropFileUploadDirective],
  providers: [],
})
export class BaPortModule {}
