import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

import { Subject } from 'rxjs';
import { ModsService } from 'src/app/services/mods.service';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Banner } from 'src/app/models/model';
import { BannerModule } from 'src/app/shared/banner/banner.component';
@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Items per page:`;
  lastPageLabel = $localize`Last page`;

  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;
  }
}

@Component({
  selector: 'app-mods',
  templateUrl: './mods.component.html',
  styleUrls: ['./mods.component.scss'],
})
export class ModsComponent implements OnInit {
  value = '';
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  mods: any;
  isLoading: boolean = true;
  banner: Banner;
  constructor(
    private modsService: ModsService,
    private router: Router,
    private route: ActivatedRoute,
    private _seoService: SEOServiceService,
    private activatedRoute: ActivatedRoute,
    private workspace: WorkspaceService,
  ) {
    this.banner = new Banner(
      'ca-pub-7561471327972639',
      1688169659,
      'fluid',
      '-6t+ed+2i-1n-4w',
      true,
    );
  }

  ngOnInit(): void {
    this.mods = Array.from({ length: 5 }, (_, i) => ({
      title: `Mod ${i + 1}`,
      description: `Mod ${i + 1} description`,
    }));
    const key = this.route.snapshot.queryParamMap.get('q');
    const page = this.route.snapshot.queryParamMap.get('page');
    const page_size = this.route.snapshot.queryParamMap.get('size');
    this.value = key ? key : '';
    this.pageSize = Number(page_size) ? Number(page_size) : 10;
    this.currentPage = Number(page) ? Number(page) : 0;

    this.loadData();

    var rt = this.getChild(this.activatedRoute);

    rt.data.subscribe((data: any) => {
      this._seoService.updateTitle(data.title);
      this._seoService.updateOgUrl(data.ogUrl);
      //Updating Description tag dynamically with title
      this._seoService.updateDescription(data.description);
    });
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  loadData() {
    this.modsService
      .getMods(this.pageSize, this.currentPage, this.value)
      .subscribe((data: any) => {
        this.mods = data;
        this.isLoading = false;
        for (var mod of this.mods) {
          var title = '';
          for (var attach of mod.attachments) {
            if (attach.fileName.endsWith('.py')) {
              title = attach.fileName;
            }
          }
          mod.title = title;
        }
      });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }
  openModPage(mod: any) {
    this.router.navigate(['/mods/' + mod.messageId], {
      queryParams: {
        q: this.value,
        page: this.currentPage,
        size: this.pageSize,
      },
    });
  }
  valueChange(event: any) {
    this.loadData();
  }

  resetSearch() {
    this.value = '';
    this.loadData();
  }
}

const routes: Routes = [{ path: '', component: ModsComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BannerModule,
    FormsModule,
  ],
  exports: [ModsComponent],
  declarations: [ModsComponent],
  providers: [],
})
export class ModsModule {}
