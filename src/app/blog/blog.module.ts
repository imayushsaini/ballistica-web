import { Component, NgModule, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Routes, RouterModule, ActivatedRoute, Router } from "@angular/router";
import { HostServerPost } from "./posts/host.server/host.server.post";
import { SEOServiceService } from "../services/seoservice.service";
import { BannerModule } from "../shared/banner/banner.component";
import { HostGCPServerPost } from "./posts/gcp/gcp.post";


@Component({
  selector: 'app-host-server',
  templateUrl: './blog.home.html',
  styleUrls: ['./blog.style.scss']
})
export class BlogPostHome implements OnInit {
  constructor(private _seoService:SEOServiceService,private activatedRoute:ActivatedRoute, private router:Router) { }

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
  openPost(link: string) {
    console.log( link);
     this.router.navigateByUrl(this.router.url+"/"+link);
  }
}

const routes: Routes = [ { path: "", component: BlogPostHome},
  {
    path: 'host-bombsquad-server-free', component: HostServerPost,
    data: {
      title:'BombSquad Server Hosting Guide',
      description:"This article presents a comprehensive guide on hosting a free BombSquad server, offering detailed insights into the process for both PC and Android devices. It contains all possible ways we can host BombSquad Server/Party with Advantage and Disadvantage about each.",
      ogUrl:'https://bombsquad-community.web.app/blog/host-bombsquad-server-free/'
    }
  },
  // {
  //   path: 'host-bombsquad-server-gcp', component: HostGCPServerPost,
  //   data: {
  //      title:'BombSquad Server | Google Cloud Platform',
  //     description:"Lets host BombSquad Server on Google Cloud Platform",
  //     ogUrl:'https://bombsquad-community.web.app/blog/host-bombsquad-server-gcp/'
  //   }
  // }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    BannerModule
    ],
  exports: [HostServerPost ],
  declarations: [HostServerPost,BlogPostHome],
  providers: []
})
export class BlogModule {
}
