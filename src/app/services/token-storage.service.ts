import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { WindowRef } from './window.service';
import { V2User } from '../models/model';

const TOKEN_KEY = 'auth-token';
const COOKIE_DAYS = 365; // Permanent cookie for 1 year

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  loginEvent = new Subject<void>();
  newUserLogin = new Subject<V2User | null>();
  private platformId = inject(PLATFORM_ID);

  constructor(private windowRef: WindowRef) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId) && typeof document !== 'undefined';
  }

  private setCookie(name: string, value: string, days: number): void {
    if (!this.isBrowser()) return;
    try {
      const maxAge = days * 24 * 60 * 60;
      const isSecure = this.windowRef.nativeWindow.location?.protocol === 'https:';
      const secureFlag = isSecure ? '; Secure' : '';
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
    } catch (e) {
      console.warn('Failed to set cookie:', e);
    }
  }

  private getCookie(name: string): string | null {
    if (!this.isBrowser()) return null;
    try {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    } catch (e) {
      console.warn('Failed to read cookie:', e);
      return null;
    }
  }

  private deleteCookie(name: string): void {
    if (!this.isBrowser()) return;
    try {
      const isSecure = this.windowRef.nativeWindow.location?.protocol === 'https:';
      const secureFlag = isSecure ? '; Secure' : '';
      document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureFlag}`;
    } catch (e) {
      console.warn('Failed to delete cookie:', e);
    }
  }

  signOut(): void {
    this.deleteCookie(TOKEN_KEY);
    try {
      this.windowRef.nativeWindow.localStorage?.removeItem(TOKEN_KEY);
      this.windowRef.nativeWindow.sessionStorage?.clear();
    } catch (_) {}
    this.loginEvent.next();
    this.newUserLogin.next(null);
  }

  saveToken(token: string): void {
    this.setCookie(TOKEN_KEY, token, COOKIE_DAYS);
    try {
      this.windowRef.nativeWindow.localStorage?.setItem(TOKEN_KEY, token);
      this.windowRef.nativeWindow.sessionStorage?.setItem(TOKEN_KEY, token);
    } catch (_) {}
    const user = this.getUser();
    this.loginEvent.next();
    this.newUserLogin.next(user);
  }

  public getToken(): string | null {
    // 1. Check permanent cookie
    let token = this.getCookie(TOKEN_KEY);
    if (token) return token;

    // 2. Fallback to localStorage (and migrate to cookie)
    try {
      token = this.windowRef.nativeWindow.localStorage?.getItem(TOKEN_KEY);
      if (token) {
        this.setCookie(TOKEN_KEY, token, COOKIE_DAYS);
        return token;
      }
    } catch (_) {}

    // 3. Fallback to sessionStorage (and migrate to cookie)
    try {
      token = this.windowRef.nativeWindow.sessionStorage?.getItem(TOKEN_KEY);
      if (token) {
        this.setCookie(TOKEN_KEY, token, COOKIE_DAYS);
        return token;
      }
    } catch (_) {}

    return null;
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
      const payload = JSON.parse(jsonPayload);
      if (payload?.exp && Date.now() >= payload.exp * 1000) {
        console.warn('JWT token has expired, clearing session.');
        this.signOut();
        return null;
      }
      return payload;
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

