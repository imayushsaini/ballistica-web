import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WindowRef } from './window.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  loginEvent = new Subject<void>();
  newUserLogin = new Subject();

  constructor( private windowRef: WindowRef) {}

  signOut(): void {
    this.loginEvent.next();
    this.windowRef.nativeWindow.sessionStorage.clear();
  }

  saveToken(token: string): void {
    this.windowRef.nativeWindow.sessionStorage.removeItem(TOKEN_KEY);
    this.windowRef.nativeWindow.sessionStorage.setItem(TOKEN_KEY, token);
    this.loginEvent.next();
  }

  public getToken(): string | null {
    return this.windowRef.nativeWindow.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    this.windowRef.nativeWindow.sessionStorage.removeItem(USER_KEY);
    this.windowRef.nativeWindow.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.newUserLogin.next(user);
  }

  public getUser(): any {
    const user = this.windowRef.nativeWindow.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}
