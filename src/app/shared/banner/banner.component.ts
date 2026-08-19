import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements AfterViewInit {
  @ViewChild('adRef') adRef!: ElementRef<HTMLElement>;
  isAdLoaded = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        try {
          ((window as any)['adsbygoogle'] = (window as any)['adsbygoogle'] || []).push({
            overlays: { bottom: true },
          });

          if (this.adRef?.nativeElement && typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(() => {
              const el = this.adRef.nativeElement;
              const status = el.getAttribute('data-ad-status');
              const hasIframe = !!el.querySelector('iframe');
              if (status === 'filled' || hasIframe || el.clientHeight > 20) {
                this.isAdLoaded = true;
                this.cd.detectChanges();
              } else if (status === 'unfilled') {
                this.isAdLoaded = false;
                this.cd.detectChanges();
              }
            });

            observer.observe(this.adRef.nativeElement, {
              attributes: true,
              childList: true,
              subtree: true,
            });
          }
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
