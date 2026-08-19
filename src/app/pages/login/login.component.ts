import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { V2User } from 'src/app/models/model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  apiKey: string = '';
  showApiKey: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoggedIn: boolean = false;
  currentUser: V2User | null = null;
  tag?: string;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private workspace: WorkspaceService,
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.currentUser = this.tokenStorage.getUser();
      this.tag = this.currentUser?.tag;
      this.isLoggedIn = true;

      const redirect = this.route.snapshot.queryParamMap.get('redirect');
      if (redirect === 'server-manager') {
        window.location.href = '/server-manager/';
        return;
      } else if (redirect) {
        this.router.navigateByUrl(redirect);
        return;
      }
    }
  }

  login(): void {
    const token = this.apiKey.trim();
    if (!token) {
      this.errorMessage = 'Please enter your Ballistica API token.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.loginWithApiKey(token).subscribe({
      next: (response) => {
        if (response.success && response.token) {
          this.tokenStorage.saveToken(response.token);
          this.tokenStorage.saveUser(response.user);
          this.currentUser = response.user;
          this.tag = response.user.tag;
          this.isLoggedIn = true;
          this.isLoading = false;
          this.successMessage = `Successfully authenticated as ${response.user.tag}!`;

          const redirect = this.route.snapshot.queryParamMap.get('redirect');
          setTimeout(() => {
            if (redirect === 'server-manager') {
              window.location.href = '/server-manager/';
            } else if (redirect) {
              this.router.navigateByUrl(redirect);
            } else {
              this.router.navigate(['/mods']);
            }
          }, 800);
        } else {
          this.isLoading = false;
          this.errorMessage = 'Authentication failed. Please check your token.';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message ||
          err?.message ||
          'Invalid or expired Ballistica API token. Please verify and try again.';
      },
    });
  }

  toggleShowApiKey(): void {
    this.showApiKey = !this.showApiKey;
  }

  clearApiKey(): void {
    this.apiKey = '';
    this.errorMessage = null;
  }

  signOut(): void {
    this.tokenStorage.signOut();
    this.isLoggedIn = false;
    this.currentUser = null;
    this.tag = '';
    this.apiKey = '';
    this.successMessage = null;
    this.errorMessage = null;
  }
}

const routes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [LoginComponent],
  declarations: [LoginComponent],
  providers: [],
})
export class LoginModule {}

