import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  @Input() isLoggedIn: boolean = false;
  @Input() tag: any;
  title = 'BombSquad';
  public isMenuCollapsed = true;
  private sub?: Subscription;

  constructor(private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.tag = user?.tag;
    this.isLoggedIn = !!this.tokenStorage.getToken();

    this.sub = this.tokenStorage.loginEvent.subscribe(() => {
      const u = this.tokenStorage.getUser();
      this.tag = u?.tag;
      this.isLoggedIn = !!this.tokenStorage.getToken();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  signout() {
    this.tokenStorage.signOut();
    this.isLoggedIn = false;
    this.tag = '';
  }
}

