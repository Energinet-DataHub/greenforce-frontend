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
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { WindowService } from '@energinet-datahub/gf/util-browser';

import { CookieInformationCulture } from './supported-cultures';

export interface CookieInformationConfig {
  culture: CookieInformationCulture;
}

@Injectable({
  providedIn: 'root',
})
export class CookieInformationService {
  private document: Document = inject(DOCUMENT);
  private window = inject(WindowService).nativeWindow;

  constructor() {
    // Loading the cookie information is not supported on localhost: https://support.cookieinformation.com/en/articles/6718369-technical-faq#h_37636a716d
    if(this.isLocalhost()) {
      this.init = () => {};
      this.reInit = () => {};
    }
  }

  // Implementation details of cookie information can be found here: https://support.cookieinformation.com/en/articles/5444177-pop-up-implementation
  init(config: CookieInformationConfig): void {
    const { culture } = config;

    // Do not load the script if we are on localhost see: https://support.cookieinformation.com/en/articles/6718369-technical-faq#h_37636a716d
    if (this.document.location.hostname === 'localhost') return;
    this.addSciptToBody(culture);
  }

  // This method is used to reinitialize the cookie information script, mostly used on language change
  reInit(config: CookieInformationConfig): void {
    this.removeScriptFromBody();
    this.init(config);

    if (!this.window) return;

    // Reload cookie information
    (this.window as any)['CookieInformation']?.loadConsent();
  }

  private isLocalhost(): boolean {
    return this.document.location.hostname === 'localhost';
  }

  private addSciptToBody(culture: CookieInformationCulture): void {
    const script = this.document.createElement('script');
    script.id = 'CookieConsent';
    script.src = 'https://policy.app.cookieinformation.com/uc.js';
    script.setAttribute('data-culture', culture.toUpperCase());
    script.setAttribute('data-gcm-version', '2.0');
    script.type = 'text/javascript';
    this.document.body.appendChild(script);
  }

  private removeScriptFromBody(): void {
    const script = this.document.getElementById('CookieConsent');
    if (script) {
      this.document.body.removeChild(script);
    }
  }
}
