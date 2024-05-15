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
import { jwtDecode } from 'jwt-decode';
import { Subscription, combineLatest, switchMap, take, tap, timer } from 'rxjs';
import { EoAuthStore, EoLoginToken } from './auth.store';
import { TranslocoService } from '@ngneat/transloco';

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
    private transloco: TranslocoService,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#authApiBase = `${apiEnvironment.apiBase}/auth`;
    console.log('auth api base', this.#authApiBase);
  }

  checkForExistingToken() {
    console.log('checking for existing token');
    this.handleToken(sessionStorage.getItem('token'));
  }

  handleLogin() {
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('handle login', token);

    this.clearToken();
    this.handleToken(this.route.snapshot.queryParamMap.get('token'));
    this.router.navigate([], {
      queryParams: {
        token: undefined,
        redirectionPath: this.route.snapshot.queryParamMap.get('redirectionPath'),
      },
      replaceUrl: true,
    });
  }

  refreshToken() {
    console.log('refreshing token');
    return this.http
      .get(`${this.#authApiBase}/token`, { responseType: 'text' })
      .pipe(tap((token) => this.handleToken(token)));
  }

  startLogin() {
    const redirectionPath = this.route.snapshot.queryParamMap.get('redirectionPath');

    let href = `${this.#authApiBase}/login?overrideRedirectionUri=${window.location.protocol}//${window.location.host}/${this.transloco.getActiveLang()}/login`;

    if (redirectionPath) href += `?redirectionPath=${redirectionPath}`;
    console.log('redirecting to:', href);

    window.location.href = href;
  }

  logout() {
    this.stopMonitor();

    console.log('logging out', this.transloco.getActiveLang());

    const isLocalhost = window.location.host.includes('localhost');
    const logoutUrl = isLocalhost
      ? `${this.#authApiBase}/logout?overrideRedirectionUri=${window.location.protocol}//${window.location.host}/${this.transloco.getActiveLang()}`
      : `${this.#authApiBase}/logout`;

    this.http.get<{ redirectionUri: string }>(logoutUrl).subscribe({
      next: (response) => {
        console.log('logging out', response.redirectionUri);
        this.clearToken();
        window.location.assign(response.redirectionUri);
      },
    });
  }

  private clearToken() {
    sessionStorage.removeItem('token');
    this.store.token.next('');
    this.store.setTokenClaims({});
  }

  private handleToken(token: string | null) {
    console.log('handle token', token);
    if (!token) return;

    const decodedToken: EoLoginToken = jwtDecode(token);

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
      this.refreshToken().pipe(take(1)).subscribe();
    }
  }
}
