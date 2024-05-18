import { Component, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { MatRipple, MatRippleModule } from '@angular/material/core';
@Component({
  selector: 'app-baport',
  templateUrl: './baport.component.html',
  styleUrl: './baport.component.scss'
})
export class BaportComponent {

  appLaunched: boolean = false;
  constructor(
    private _seoService: SEOServiceService,
    private activatedRoute: ActivatedRoute,
  ) {}
   ngOnInit(): void {
    var rt = this.getChild(this.activatedRoute);

    rt.data.subscribe((data: any) => {
      this._seoService.updateTitle(data.title);
      this._seoService.updateOgUrl(data.ogUrl);
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

  launch() {
    this.appLaunched = true;
  }


}


const routes: Routes = [{ path: '', component: BaportComponent }];

@NgModule({
  imports: [CommonModule, MatButtonModule, MatRippleModule, RouterModule.forChild(routes)],
  exports: [BaportComponent],
  declarations: [BaportComponent],
  providers: [],
})
export class BaPortModule {}
