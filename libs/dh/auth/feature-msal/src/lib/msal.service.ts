/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
  IPublicClientApplication,
  EndSessionRequest,
  EndSessionPopupRequest,
  AuthenticationResult,
  RedirectRequest,
  SilentRequest,
  PopupRequest,
  SsoSilentRequest,
  Logger,
  WrapperSKU,
} from '@azure/msal-browser';
import { IMsalService, version } from '@azure/msal-angular';
import { MSAL_INSTANCE } from './msal-constants';
import { from, Observable } from 'rxjs';

@Injectable()
export class MsalService implements IMsalService {
  private redirectHash?: string;
  private logger?: Logger;

  constructor(
    @Inject(MSAL_INSTANCE) public instance: IPublicClientApplication,
    private location: Location
  ) {
    const hash = this.location.path(true).split('#').pop();
    if (hash) {
      this.redirectHash = `#${hash}`;
    }
    this.instance.initializeWrapperLibrary(WrapperSKU.Angular, version);
  }

  acquireTokenPopup(request: PopupRequest): Observable<AuthenticationResult> {
    return from(this.instance.acquireTokenPopup(request));
  }
  acquireTokenRedirect(request: RedirectRequest): Observable<void> {
    return from(this.instance.acquireTokenRedirect(request));
  }
  acquireTokenSilent(
    silentRequest: SilentRequest
  ): Observable<AuthenticationResult> {
    return from(this.instance.acquireTokenSilent(silentRequest));
  }
  handleRedirectObservable(hash?: string): Observable<AuthenticationResult> {
    return from(
      this.instance.handleRedirectPromise(
        hash || this.redirectHash
      ) as Promise<AuthenticationResult>
    );
  }
  loginPopup(request?: PopupRequest): Observable<AuthenticationResult> {
    return from(this.instance.loginPopup(request));
  }
  loginRedirect(request?: RedirectRequest): Observable<void> {
    return from(this.instance.loginRedirect(request));
  }
  logout(logoutRequest?: EndSessionRequest): Observable<void> {
    return from(this.instance.logout(logoutRequest));
  }
  logoutRedirect(logoutRequest?: EndSessionRequest): Observable<void> {
    return from(this.instance.logoutRedirect(logoutRequest));
  }
  logoutPopup(logoutRequest?: EndSessionPopupRequest): Observable<void> {
    return from(this.instance.logoutPopup(logoutRequest));
  }
  ssoSilent(request: SsoSilentRequest): Observable<AuthenticationResult> {
    return from(this.instance.ssoSilent(request));
  }
  /**
   * Gets logger for msal-angular.
   * If no logger set, returns logger instance created with same options as msal-browser
   */
  getLogger(): Logger {
    if (!this.logger) {
      this.logger = this.instance
        .getLogger()
        .clone('@azure/msal-angular', version);
    }
    return this.logger;
  }
  // Create a logger instance for msal-angular with the same options as msal-browser
  setLogger(logger: Logger): void {
    this.logger = logger.clone('@azure/msal-angular', version);
    this.instance.setLogger(logger);
  }
}
