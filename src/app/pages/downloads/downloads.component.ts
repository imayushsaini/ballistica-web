import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BannerModule } from 'src/app/shared/banner/banner.component';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss'],
})
export class DownloadsComponent implements OnInit {
  selectedFaq: number | null = null;

  constructor(
    private _seoService: SEOServiceService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const rt = this.getChild(this.activatedRoute);

    rt.data.subscribe((data: any) => {
      this._seoService.updateTitle(data.title || 'Download BombSquad Game, Remote Controller & Dedicated Server Builds | BCS');
      this._seoService.updateOgUrl(data.ogUrl || 'https://bombsquad-community.web.app/download');
      this._seoService.updateDescription(
        data.description ||
          'Download official BombSquad game for Android, Windows PC, Linux, macOS, and VR. Get BombSquad Remote controller app, dedicated server scripts, or browse community mods.'
      );
      this._seoService.updateKeywords(
        'download bombsquad, bombsquad pc, bombsquad windows, bombsquad android, bombsquad mac, bombsquad linux, bombsquad remote, bombsquad controller, bombsquad server download, bombsquad mods download'
      );
    });
  }

  toggleFaq(index: number): void {
    this.selectedFaq = this.selectedFaq === index ? null : index;
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}

const routes: Routes = [{ path: '', component: DownloadsComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BannerModule,
  ],
  exports: [DownloadsComponent],
  declarations: [DownloadsComponent],
  providers: [],
})
export class DownloadModule {}
