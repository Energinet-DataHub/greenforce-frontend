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
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { eoLandingPageRelativeUrl, eoTermsRoutePath } from '@energinet-datahub/eo/shared/utilities';
import jwt_decode from 'jwt-decode';
import { EoAuthStore, EoLoginToken } from './auth.store';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EoAuthService {
  #loginUrl: string;
  #authApiBase: string;

  constructor(
    private http: HttpClient,
    private store: EoAuthStore,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#authApiBase = `${apiEnvironment.apiBase}/auth`;
    this.#loginUrl = `${apiEnvironment.apiBase}/auth/oidc/login?fe_url=${window.location.origin}&return_url=${window.location.origin}/dashboard`;
  }

  handlePostLogin() {
    this.handleToken();
    this.handleTermsAcceptance();
  }

  refreshToken() {
    this.http.get<string>(`${this.#authApiBase}/token`).subscribe((newToken) => {
      sessionStorage.setItem('token', newToken);
      this.handleToken();
    });
  }

  login() {
    window.location.href = `${this.#authApiBase}/login?overrideRedirectionUri=${
      window.location.protocol
    }//${window.location.host}/dashboard`;
  }

  logout() {
    // TODO: Navigate til /api/auth/logout med bearer token headeren
    sessionStorage.removeItem('token');
    this.http.post(`${this.#authApiBase}/logout`, {}).subscribe({
      next: () => this.router.navigateByUrl(eoLandingPageRelativeUrl),
      error: () => this.router.navigateByUrl(eoLandingPageRelativeUrl),
    });
  }

  private handleTermsAcceptance() {
    this.store.getScope$.subscribe((scope) => {
      if (scope.includes('not-accepted-terms') === true) {
        this.router.navigate([eoTermsRoutePath]);
      }
    });
  }

  private handleToken() {
    const token = sessionStorage.getItem('token') ?? this.route.snapshot.queryParamMap.get('token');
    if (!token) return;

    const decodedToken = jwt_decode(token) as EoLoginToken;

    sessionStorage.setItem('token', token);
    this.store.token.next(token);
    this.store.setTokenClaims(decodedToken);

    this.router.navigate([], {
      queryParams: { token: undefined },
      replaceUrl: true,
    });
  }
}
