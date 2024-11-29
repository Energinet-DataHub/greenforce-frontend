import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  private platformId = inject(PLATFORM_ID);

  get nativeWindow(): Window | null {
    if (isPlatformBrowser(this.platformId)) {
      return window;
    }
    return null;
  }
}
