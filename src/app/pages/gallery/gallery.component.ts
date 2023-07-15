import { Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule, Routes } from "@angular/router";
import { SEOServiceService } from "src/app/services/seoservice.service";
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { MatIconModule } from '@angular/material/icon';
import { images } from './image_map';
import { BannerModule } from "src/app/shared/banner/banner.component";
import { Banner } from "src/app/models/model";
@Component({
  selector: 'app-Gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  images: { url: string; alt: string; }[] = images;

  currentimages:{ url: string, alt: string }[] = this.images.slice(0, 12);
  startPoint = 0;
  endPoint = 12;
  showOverlay = false;
  selectedImage!: { url: string; alt: string; };
   banner: Banner;
  CDN = "https://scintillating-creponne-d386aa.netlify.app";
  constructor(private http: HttpClient, private _seoService: SEOServiceService, private activatedRoute: ActivatedRoute) {
    this.banner = new Banner(
      'ca-pub-7561471327972639',
      1688169659,
        'fluid',
      '-6t+ed+2i-1n-4w',
      true
      )
  }

  ngOnInit(): void {
    var rt = this.getChild(this.activatedRoute)
    rt.data.subscribe((data: any) => {
          this._seoService.updateTitle(data.title);
          this._seoService.updateOgUrl(data.ogUrl);
          //Updating Description tag dynamically with title
          this._seoService.updateDescription(data.description)
        });
  }
  getChild(activatedRoute: ActivatedRoute):any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
  scrollUp() {
    this.startPoint -= 8;
    this.endPoint -= 8;
    if (this.startPoint < 0) {
      this.startPoint = 0;
      this.endPoint = 12;
    }
    this.currentimages = this.images.slice(this.startPoint, this.endPoint);
  }
  scrollDown() {
    this.startPoint += 8;
    this.endPoint += 8;
    if (this.endPoint > this.images.length) {
      this.endPoint = this.images.length;
      this.startPoint = this.endPoint - 12;
    }

    this.currentimages = this.images.slice(this.startPoint, this.endPoint);

  }
  openOverlay(image: { url: string, alt: string }) {
    this.selectedImage = image;
    this.showOverlay = true;
  }
  closeOverlay() {
    this.showOverlay = false;
  }
}

const routes: Routes = [{path: '', component: GalleryComponent}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    BannerModule,
    ],
  exports: [GalleryComponent],
  declarations: [GalleryComponent],
  providers: []
})
export class GalleryModule {
}
