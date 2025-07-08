//#region License
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
//#endregion
import { Injectable, inject, NgZone, signal, DOCUMENT } from '@angular/core';

import { Observable } from 'rxjs';

import { WindowService } from '@energinet-datahub/gf/util-browser';

import { CookieInformationCulture } from './supported-cultures';
import { COOKIE_CATEGORIES } from './cookie-information.constants';
import { ConsentStatus, CookieCategory, CookieInformationConfig } from './cookie-information.types';
import { toObservable } from '@angular/core/rxjs-interop';

const LOCALHOST = 'localhost';

@Injectable({
  providedIn: 'root',
})
export class CookieInformationService {
  private consentStatus = signal<ConsentStatus>(this.getCurrentConsentStatus());
  getConsentStatus = this.consentStatus.asReadonly();
  consentGiven$: Observable<ConsentStatus> = toObservable(this.consentStatus);

  private document: Document = inject(DOCUMENT);
  private window = inject(WindowService).nativeWindow;
  private ngZone = inject(NgZone);
  private consentListenerAdded = false;

  // Implementation details of cookie information can be found here: https://support.cookieinformation.com/en/articles/5444177-pop-up-implementation
  init(config: CookieInformationConfig): void {
    if (this.shouldNotLoadScript()) return;

    const { culture } = config;
    this.addScriptToBody(culture);
    this.setupConsentListener();
  }

  // This method is used to reinitialize the cookie information script, mostly used on language change
  reInit(config: CookieInformationConfig): void {
    if (this.shouldNotLoadScript()) return;

    const { culture } = config;
    this.addScriptToBody(culture);

    // Reload cookie information
    this.window?.CookieInformation?.loadConsent();
  }

  // Helper method to check consent for a specific category
  isConsentGiven(category: CookieCategory): boolean {
    return this.consentStatus()[category] ?? false;
  }

  // Helper method to open the cookie information dialog, mostly used for custom buttons
  openDialog(): void {
    this.window?.CookieInformation?.renew();
  }

  private shouldNotLoadScript(): boolean {
    // Do not load the script if we are on localhost see: https://support.cookieinformation.com/en/articles/6718369-technical-faq#h_37636a716d
    return this.isLocalhost();
  }

  private getDefaultConsentStatus(): ConsentStatus {
    return Object.values(COOKIE_CATEGORIES).reduce((status, category) => {
      status[category] = category === COOKIE_CATEGORIES.NECESSARY; // Necessary cookies are always accepted
      return status;
    }, {} as ConsentStatus);
  }

  private getCurrentConsentStatus(): ConsentStatus {
    if (!this.window?.CookieInformation || this.isLocalhost()) {
      return this.getDefaultConsentStatus();
    }

    return Object.values(COOKIE_CATEGORIES).reduce((status, category) => {
      status[category] = !!this.window?.CookieInformation?.getConsentGivenFor(category);
      return status;
    }, {} as ConsentStatus);
  }

  private setupConsentListener(): void {
    if (this.consentListenerAdded) return;

    this.window?.addEventListener('CookieInformationConsentGiven', (event: Event) => {
      const customEvent = event as CustomEvent<{ consents: ConsentStatus }>;
      this.ngZone.run(() => {
        this.consentStatus.set(customEvent.detail.consents);
      });
    });

    this.consentListenerAdded = true;
  }

  private isLocalhost(): boolean {
    return this.document.location.hostname === LOCALHOST;
  }

  private addScriptToBody(culture: CookieInformationCulture): void {
    let script = this.document.getElementById('CookieConsent') as HTMLScriptElement;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'CookieConsent';
      script.src = 'https://policy.app.cookieinformation.com/uc.js';
      script.setAttribute('data-culture', culture.toUpperCase());
      script.setAttribute('data-gcm-version', '2.0');
      script.type = 'text/javascript';
      this.document.body.appendChild(script);
    } else {
      script.setAttribute('data-culture', culture.toUpperCase());
    }
  }
}
