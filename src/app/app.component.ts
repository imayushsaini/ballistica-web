import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TokenStorageService } from './services/token-storage.service';
import { SwUpdate } from '@angular/service-worker';

declare const gtag: Function;

declare global {
  interface Window {
    adsbygoogle: any;
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ballistica-web';
  isLoggedIn = false;
  subscription: any;
  tag?: string;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private swUpdate: SwUpdate,
  ) {
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        /** START : Code to Track Page View  */
        if (isPlatformBrowser(this.platformId)) {
          gtag('event', 'page_view', {
            page_path: this.router.url,
          });
        }
        /** END */
      });
    if (swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((evt) => {
        switch (evt.type) {
          case 'VERSION_DETECTED':
            console.log(`Downloading new app version: ${evt.version.hash}`);
            break;
          case 'VERSION_READY':
            console.log(`Current app version: ${evt.currentVersion.hash}`);
            console.log(
              `New app version ready for use: ${evt.latestVersion.hash}`,
            );
            this.swUpdate
              .activateUpdate()
              .then(() => document.location.reload());
            break;
          case 'VERSION_INSTALLATION_FAILED':
            console.log(
              `Failed to install app version '${evt.version.hash}': ${evt.error}`,
            );
            break;
        }
      });
    }
  }
  private tokenExpired(token: any) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  ngOnInit(): void {
    let token = this.tokenStorage.getToken();
    if (token && this.tokenExpired(token)) {
      this.tokenStorage.signOut();
    }
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      this.tag = user.tag;
    }

    this.subscription = this.tokenStorage.loginEvent.subscribe(() => {
      const user = this.tokenStorage.getUser();
      this.isLoggedIn = !!this.tokenStorage.getToken();
    });
    this.tokenStorage.newUserLogin.subscribe(() => {
      const user = this.tokenStorage.getUser();
      this.isLoggedIn = !!this.tokenStorage.getToken();
    });
  }
}
