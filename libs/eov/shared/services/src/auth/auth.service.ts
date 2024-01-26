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
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  EovApiEnvironment,
  eovApiEnvironmentToken,
} from '@energinet-datahub/eov/shared/environments';
import { Subscription, combineLatest, map, switchMap, take, timer } from 'rxjs';
import { EovAuthStore } from './auth.store';
import jwt_decode from 'jwt-decode';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EovAuthService {
  subscription$: Subscription | undefined;
  #authApiBase: string;
  http: HttpClient;

  constructor(
    httpBackend: HttpBackend,
    private authStore: EovAuthStore,
    private route: ActivatedRoute,
    @Inject(eovApiEnvironmentToken) private apiEnvironment: EovApiEnvironment
  ) {
    this.http = new HttpClient(httpBackend);
    this.#authApiBase = `${apiEnvironment.apiUrl}/customer/auth`;
    route.queryParams.subscribe((params) => {
      const link = params['link'];
      if (link) {
        this.handleLogin(link);
      }
    });
  }

  hasToken() {
    return !!this.authStore.token.getValue();
  }

  hasTokenObservable() {
    return this.authStore.token.pipe(map((token) => {
      return !!token;
    }));
  }

  checkForExistingToken() {
    this.handleToken(sessionStorage.getItem('token'));
  }

  handleLogin(link: string) {
    this.clearToken();
    this.http
      .get<PortalTokenResponse>(decodeURIComponent(link))
      .pipe(take(1))
      .subscribe((token) => {
        sessionStorage.setItem('refreshToken', token.refreshToken);
        this.handleToken(token.token);
      });
  }

  refreshToken() {
    // return this.http
    //   .get(`${this.#authApiBase}/token`, { responseType: 'text' })
    //   .pipe(tap((token) => this.handleToken(token)));
  }

  startLogin() {
    const redirectionPath = this.route.snapshot.queryParamMap.get('redirectionPath');

    let href = `${this.#authApiBase}/login?overrideRedirectionUri=${window.location.protocol}//${window.location.host}/login`;

    if (redirectionPath) href += `?redirectionPath=${redirectionPath}`;

    window.location.href = href;
  }

  getUserName() {
    this.checkForExistingToken();
    if (!this.authStore.token.getValue()) {
      return '';
    }
    const decodedToken: { given_name?: string } = jwt_decode(this.authStore.token.getValue());
    return decodedToken.given_name ?? '';
  }

  getUserType() {
    // const decodedToken: { company?: string } = jwt_decode(this.authStore.token.getValue());
    // return !!decodedToken.company;
  }

  loginAsCustomer() {
    window.location.href =
      `${this.apiEnvironment.netsBaseURL}/connect/authorize` +
      `?response_type=code&client_id=${this.apiEnvironment.clientId}` +
      `&prompt=true` +
      `&redirect_uri=${this.apiEnvironment.apiUrl}/customer/api/oidc/callback` +
      `&language=da&scope=mitid+openid+userinfo_token+ssn` +
      `&idp_values=mitid&idp_params=%7B%22mitid%22%3A%7B%22reference_text%22%3A%22TG9naW4gdGlsIEVsT3ZlcmJsaWs%3D%22%7D%7D` +
      `&state=${btoa(JSON.stringify({ webApp: 11, completionUri: 'http://localhost:4200/overview' }))}`;
  }

  loginAsCorp() {
    window.location.href =
      `${this.apiEnvironment.netsBaseURL}/connect/authorize` +
      `?response_type=code&client_id=${this.apiEnvironment.clientId}` +
      `&prompt=true` +
      `&redirect_uri=${this.apiEnvironment.apiUrl}/customer/api/oidc/callback` +
      `&language=da&scope=nemid+openid+ssn+userinfo_token+nemlogin` +
      `&idp_values=nemid+mitid_erhverv&idp_params=%7B%22nemid%22%3A%7B%22amr_values%22%3A%22nemid.keyfile%20nemid.otp%22%2C%22private_to_business%22%3Atrue%2C%22code_app_trans_ctx%22%3A%22TG9naW4gdGlsIEVsT3ZlcmJsaWs%3D%22%7D%7D` +
      `&state=${btoa(JSON.stringify({ webApp: 11, completionUri: 'http://localhost:4200/overview' }))}`;
  }

  loginAsThirdParty() {
    window.location.href =
      `${this.apiEnvironment.netsBaseURL}/connect/authorize` +
      `?response_type=code&client_id=${this.apiEnvironment.clientId}` +
      `&prompt=true` +
      `&redirect_uri=${this.apiEnvironment.apiUrl}/thirdparty/api/oidc/callback` +
      `&language=da&scope=nemid+openid+ssn+userinfo_token+nemlogin` +
      `&idp_values=nemid+mitid_erhverv&idp_params=%7B%22nemid%22%3A%7B%22amr_values%22%3A%22nemid.keyfile%20nemid.otp%22%2C%22private_to_business%22%3Atrue%2C%22code_app_trans_ctx%22%3A%22TG9naW4gdGlsIEVsT3ZlcmJsaWs%3D%22%7D%7D` +
      `&state=${btoa(JSON.stringify({ webApp: 13, completionUri: 'http://localhost:4200/overview' }))}`;
  }

  logout() {
    this.stopMonitor();

    const isLocalhost = window.location.host.includes('localhost');
    const logoutUrl = isLocalhost
      ? `${this.#authApiBase}/logout?overrideRedirectionUri=${window.location.protocol}//${window.location.host}`
      : `${this.#authApiBase}/logout`;

    this.http.get<{ redirectionUri: string }>(logoutUrl).subscribe({
      next: (response) => {
        sessionStorage.removeItem('token');
        window.location.href = response.redirectionUri;
      },
      error: () => {
        // TODO: Remove this when the backend for the "next" method has been deployed
        sessionStorage.removeItem('token');
        const logoutUrl = `${this.#authApiBase}/logout`;
        window.location.href = isLocalhost
          ? `${logoutUrl}?overrideRedirectionUri=${window.location.protocol}//${window.location.host}`
          : logoutUrl;
      },
    });
  }

  private clearToken() {
    // this.store.isTokenExpired$.subscribe((state) => {
    //   if (state === true) {
    //     sessionStorage.removeItem('token');
    //     this.store.token.next('');
    //     this.store.setTokenClaims({});
    //   }
    // });
  }

  private handleToken(token: string | null) {
    if (!token) return;
    sessionStorage.setItem('token', token);
    this.authStore.token.next(token);
    // this.store.isTokenExpired$
    //   .pipe(take(1))
    //   .subscribe((expired) => !expired && this.startMonitor());
  }

  private startMonitor() {
    this.subscription$?.unsubscribe();
    this.subscription$ = timer(0, 5000)
      .pipe(
        switchMap(() =>
          combineLatest({ exp: this.authStore.getTokenExpiry$, nbf: this.authStore.getTokenNotBefore$ })
        )
      )
      .subscribe(({ exp, nbf }) => this.whenTimeThresholdReached(exp, nbf));
  }

  private stopMonitor() {
    this.subscription$?.unsubscribe();
  }

  private whenTimeThresholdReached(exp: number, nbf: number) {
    // const totalTime = exp - nbf;
    // const timeLeftThreshold = totalTime * 0.2;
    // const remainingTime = exp - Date.now() / 1000;
    // if (remainingTime <= timeLeftThreshold) {
    //   this.refreshToken().pipe(take(1)).subscribe();
    // }
  }
}

type PortalTokenResponse = {
  token: string;
  refreshToken: string;
  expireTime: Date;
  isSucceeded?: boolean;
  validationError?: NemidValidationError;
}

type NemidValidationError = {
  errorMessage: string;
  userMessage: string;
  flowErrorCode: string;
  flowExpired: boolean;
  status: FlowStatus;
}

enum FlowStatus {
  Ok = 0,
  UserCancel = 1,
  ClientFlowError = 2,
  FlowError = 3,
  ValidationError = 4,
}
