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
import jwt_decode from 'jwt-decode';
import { EoAuthStore, EoLoginToken } from './auth.store';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EoAuthService {
  #authApiBase: string;

  constructor(
    private http: HttpClient,
    private store: EoAuthStore,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#authApiBase = `${apiEnvironment.apiBase}/auth`;
  }

  checkForExistingToken() {
    this.handleToken(sessionStorage.getItem('token'));
  }

  handlePostLogin() {
    this.clearToken();
    this.handleToken(this.route.snapshot.queryParamMap.get('token'));
    this.router.navigate([], {
      queryParams: { token: undefined },
      replaceUrl: true,
    });
  }

  refreshToken(waitTime = 0) {
    setTimeout(
      () =>
        this.http
          .get(`${this.#authApiBase}/token`, { responseType: 'text' })
          .subscribe(async (newToken) => {
            this.handleToken(newToken);
          }),
      waitTime
    );
  }

  startLogin() {
    window.location.href = `${this.#authApiBase}/login?overrideRedirectionUri=${
      window.location.protocol
    }//${window.location.host}/login`;
  }

  logout() {
    sessionStorage.removeItem('token');
    window.location.href = `${this.#authApiBase}/logout?overrideRedirectionUri=${
      window.location.protocol
    }//${window.location.host}`;
  }

  private clearToken() {
    sessionStorage.removeItem('token');
    this.store.token.next('');
    this.store.setTokenClaims({});
  }

  private handleToken(token: string | null) {
    if (!token) return;

    const decodedToken = jwt_decode(token) as EoLoginToken;

    sessionStorage.setItem('token', token);
    this.store.token.next(token);
    this.store.setTokenClaims(decodedToken);
  }
}
