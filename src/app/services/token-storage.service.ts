import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WindowRef } from './window.service';
import { V2User } from '../models/model';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  loginEvent = new Subject<void>();
  newUserLogin = new Subject<V2User | null>();

  constructor(private windowRef: WindowRef) {}

  signOut(): void {
    this.windowRef.nativeWindow.sessionStorage.clear();
    this.loginEvent.next();
  }

  saveToken(token: string): void {
    this.windowRef.nativeWindow.sessionStorage.removeItem(TOKEN_KEY);
    this.windowRef.nativeWindow.sessionStorage.setItem(TOKEN_KEY, token);
    const user = this.getUser();
    this.loginEvent.next();
    this.newUserLogin.next(user);
  }

  public getToken(): string | null {
    return this.windowRef.nativeWindow.sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Decodes the JWT payload in-memory without making any network requests.
   */
  public getJwtPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode JWT payload:', e);
      return null;
    }
  }

  /**
   * Extracts user data directly from the JWT payload.
   */
  public getUser(): V2User | any {
    const payload = this.getJwtPayload();
    if (!payload) return {};

    if (payload.account) {
      return payload.account;
    }

    return {
      id: payload.id || '',
      tag: payload.tag || '',
      create_time: payload.create_time || '',
      last_active_day: payload.last_active_day || null,
      total_active_days: payload.total_active_days || 0,
    };
  }

  /**
   * Kept for backwards compatibility
   */
  public saveUser(user: any): void {
    this.newUserLogin.next(user);
  }
}

