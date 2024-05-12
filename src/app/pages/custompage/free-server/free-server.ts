import { Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule, Routes } from "@angular/router";
import { SEOServiceService } from "src/app/services/seoservice.service";
import { MatButtonModule} from '@angular/material/button';
import { HttpClient } from "@angular/common/http";
import { BannerModule } from "src/app/shared/banner/banner.component";
import { FreeServerService } from "src/app/services/free-server.service";
import { CommonModule } from "@angular/common";
@Component({
  selector: 'app-free-server',
  templateUrl: './free-server.html',
  styleUrls: ['./free-server.scss']
})
export class FreeServer implements OnInit {
  passcode: string | null | undefined;
  password: string | null | undefined;
  duration: string | null | undefined;
  message: string | undefined;
  constructor(private http:HttpClient ,private _seoService:SEOServiceService,private activatedRoute:ActivatedRoute , private service: FreeServerService) { }

  ngOnInit(): void {
    var rt = this.getChild(this.activatedRoute)
    rt.data.subscribe((data: any) => {
          this._seoService.updateTitle(data.title);
          this._seoService.updateOgUrl(data.ogUrl);
          //Updating Description tag dynamically with title
          this._seoService.updateDescription(data.description)
    });
    const key = this.activatedRoute.snapshot.queryParamMap.get('token');
    if (key) {
      this.service.getPasscode(key).subscribe((data: any) => {
        console.log(data)
        this.passcode = data['body']['passcode'];
        this.password = key
        this.duration = data['body']['minutesLeft']
      }, error => {
        console.log(error)
        this.message = error.error;
        console.log(this.message)
    })
    }
  }

  getChild(activatedRoute: ActivatedRoute):any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}

const routes: Routes = [{path: '', component: FreeServer}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    BannerModule
    ],
  exports: [FreeServer],
  declarations: [FreeServer],
  providers: []
})
export class FreeServerModule {
}
