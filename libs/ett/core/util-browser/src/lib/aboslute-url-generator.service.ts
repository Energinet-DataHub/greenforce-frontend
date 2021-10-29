import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router, UrlCreationOptions } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AbsoluteUrlGenerator {
  #ensureTrailingSlash(url: string): string {
    return url.endsWith('/') ? url : url + '/';
  }

  #externalUrl(appUrl: string): string {
    return (
      this.#ensureTrailingSlash(this.baseHref) +
      this.#removeLeadingSlash(appUrl)
    );
  }

  #removeLeadingSlash(url: string): string {
    return url.replace(/^\//, '');
  }

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private router: Router
  ) {}

  fromUrl(appUrl: string): string {
    return this.#externalUrl(appUrl);
  }

  fromCommands(routeCommands: unknown[], extras?: UrlCreationOptions): string {
    const appUrl = this.router.serializeUrl(
      this.router.createUrlTree(routeCommands, extras)
    );

    return this.#externalUrl(appUrl);
  }
}
