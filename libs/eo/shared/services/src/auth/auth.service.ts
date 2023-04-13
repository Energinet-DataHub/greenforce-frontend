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
import { combineLatest, Subscription, switchMap, take, timer } from 'rxjs';
import { EoAuthStore, EoLoginToken } from './auth.store';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EoAuthService {
  subscription$: Subscription | undefined;
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

  handleLogin() {
    this.clearToken();
    this.handleToken(this.route.snapshot.queryParamMap.get('token'));
    this.router.navigate([], {
      queryParams: { token: undefined },
      replaceUrl: true,
    });
  }

  refreshToken(waitTime = 0) {
    /** We add a delay so changes in backend can propagate out before we ask for a token again */
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
    const loginUrl = `${this.#authApiBase}/login`;
    window.location.href = window.location.host.includes('localhost')
      ? `${loginUrl}?overrideRedirectionUri=${window.location.protocol}//${window.location.host}/login`
      : loginUrl;
  }

  logout() {
    this.stopMonitor();
    sessionStorage.removeItem('token');
    const logoutUrl = `${this.#authApiBase}/logout`;
    window.location.href = window.location.host.includes('localhost')
      ? `${logoutUrl}?overrideRedirectionUri=${window.location.protocol}//${window.location.host}`
      : logoutUrl;
  }

  private clearToken() {
    this.store.isTokenExpired$.subscribe((state) => {
      if (state === true) {
        sessionStorage.removeItem('token');
        this.store.token.next('');
        this.store.setTokenClaims({});
      }
    });
  }

  private handleToken(token: string | null) {
    if (!token) return;

    const decodedToken = jwt_decode(token) as EoLoginToken;

    sessionStorage.setItem('token', token);
    this.store.token.next(token);
    this.store.setTokenClaims(decodedToken);
    this.store.isTokenExpired$
      .pipe(take(1))
      .subscribe((expired) => !expired && this.startMonitor());
  }

  private startMonitor() {
    this.subscription$?.unsubscribe();
    this.subscription$ = timer(0, 5000)
      .pipe(
        switchMap(() =>
          combineLatest({ exp: this.store.getTokenExpiry$, nbf: this.store.getTokenNotBefore$ })
        )
      )
      .subscribe(({ exp, nbf }) => this.whenTimeThresholdReached(exp, nbf));
  }

  private stopMonitor() {
    this.subscription$?.unsubscribe();
  }

  private whenTimeThresholdReached(exp: number, nbf: number) {
    const totalTime = exp - nbf;
    const timeLeftThreshold = totalTime * 0.2;
    const remainingTime = exp - Date.now() / 1000;
    if (remainingTime <= timeLeftThreshold) {
      this.refreshToken();
    }
  }
}
