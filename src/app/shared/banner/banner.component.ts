import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  NgModule,
} from '@angular/core';
import { Banner } from '../../models/model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        try {
          ((window as any)['adsbygoogle'] = (window as any)['adsbygoogle'] || []).push({
            overlays: { bottom: true },
          });
        } catch (e) {
          console.error(e);
        }
      }, 0);
    }
  }
}

@NgModule({
  declarations: [BannerComponent],
  imports: [CommonModule],
  exports: [BannerComponent],
})
export class BannerModule {}
