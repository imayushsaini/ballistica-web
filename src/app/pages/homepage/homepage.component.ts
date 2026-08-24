import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterModule,
  Routes,
} from '@angular/router';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BannerModule } from 'src/app/shared/banner/banner.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface VideoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  embedUrl?: SafeResourceUrl;
  isLoaded: boolean;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageComponent implements OnInit {
  videos: VideoItem[] = [
    {
      id: 'pgq8sOCgU98',
      title: 'BombSquad Official Trailer',
      category: 'Trailer',
      description: 'Experience explosive 8-player party action, physics-based combat, and mini-games.',
      isLoaded: false,
    },
    {
      id: 'RJlY4b8P6yQ',
      title: 'BombSquad Gameplay & Modding Showcase',
      category: 'Gameplay',
      description: 'Watch thrilling community mini-games, custom characters, and chaotic bomb battles.',
      isLoaded: false,
    },
    {
      id: 'HuZwgDU7n8Y',
      title: 'How to Install BombSquad Mods & Plugins',
      category: 'Tutorial',
      description: 'Step-by-step guide on downloading and installing custom mods into your game.',
      isLoaded: false,
    },
    {
      id: '1NJO_j16H4o',
      title: 'BombSquad Server Hosting & Custom Modes',
      category: 'Guide',
      description: 'Learn how to set up, configure, and manage your own multiplayer game server.',
      isLoaded: false,
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private _seoService: SEOServiceService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    const rt = this.getChild(this.activatedRoute);
    rt.data.subscribe((data: any) => {
      this._seoService.updateTitle(
        data.title || 'BombSquad Community — The Ultimate Modding Hub, Servers & Workspaces | BCS'
      );
      this._seoService.updateOgUrl(data.ogUrl || 'https://bombsquad-community.web.app/home');
      this._seoService.updateDescription(
        data.description ||
          'Explore 500+ BombSquad mods & Python plugins, manage Ballistica cloud workspaces, browse real-time public servers, and find official game & controller downloads.'
      );
      this._seoService.updateKeywords(
        'bombsquad, bombsquad community, bombsquad mods, bombsquad plugins, bombsquad servers, ballistica workspaces, bombsquad download, bombsquad mod manager, bombsquad remote, bombsquad hosting'
      );
      this._seoService.updateOgImage('https://bombsquad-community.web.app/assets/img/mainLogo.webp');
    });
  }

  loadVideo(video: VideoItem): void {
    if (!video.isLoaded) {
      video.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${video.id}?autoplay=1`
      );
      video.isLoaded = true;
      this.changeDetectorRef.detectChanges();
    }
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}

const routes: Routes = [{ path: '', component: HomepageComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatButtonModule,
    BannerModule,
  ],
  exports: [HomepageComponent],
  declarations: [HomepageComponent],
  providers: [],
})
export class HomepageModule {}
