/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
    return this.#ensureTrailingSlash(this.baseHref) + this.#removeLeadingSlash(appUrl);
  }

  #removeLeadingSlash(url: string): string {
    return url.replace(/^\//, '');
  }

  constructor(@Inject(APP_BASE_HREF) private baseHref: string, private router: Router) {}

  fromUrl(appUrl: string): string {
    return this.#externalUrl(appUrl);
  }

  fromCommands(routeCommands: unknown[], extras?: UrlCreationOptions): string {
    const appUrl = this.router.serializeUrl(this.router.createUrlTree(routeCommands, extras));

    return this.#externalUrl(appUrl);
  }
}
