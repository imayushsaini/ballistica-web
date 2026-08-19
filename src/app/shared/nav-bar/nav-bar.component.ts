import { Component, Input, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
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
  public isUserMenuOpen = false;
  private sub?: Subscription;

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router,
    private elRef: ElementRef,
  ) {}

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

  toggleUserMenu(event?: Event): void {
    if (event) event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }

  navigateToWorkspaces(): void {
    this.isUserMenuOpen = false;
    this.isMenuCollapsed = true;
    this.router.navigate(['/workspaces']);
  }

  signout(): void {
    this.isUserMenuOpen = false;
    this.isMenuCollapsed = true;
    this.tokenStorage.signOut();
    this.isLoggedIn = false;
    this.tag = '';
  }
}

