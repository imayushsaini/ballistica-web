import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const mockStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};

@Injectable({
  providedIn: 'root',
})
export class WindowRef {
  private platformId = inject(PLATFORM_ID);

  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      return window;
    }
    return {
      sessionStorage: mockStorage,
      localStorage: mockStorage,
      location: { href: '', reload: () => {} },
      open: () => null,
    };
  }
}
