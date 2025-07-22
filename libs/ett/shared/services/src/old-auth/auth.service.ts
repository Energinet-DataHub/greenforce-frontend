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
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EttApiEnvironment, ettApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';
import { jwtDecode } from 'jwt-decode';
import { Subscription, combineLatest, switchMap, take, tap, timer } from 'rxjs';
import { EttAuthStore, EttLoginToken } from './auth.store';
import { TranslocoService } from '@jsverse/transloco';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EttAuthService {
  private http = inject(HttpClient);
  private store = inject(EttAuthStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);
  private apiEnvironment = inject<EttApiEnvironment>(ettApiEnvironmentToken);

  subscription$: Subscription | undefined;
  #authApiBase: string;

  constructor() {
    this.#authApiBase = `${this.apiEnvironment.apiBase}/auth`;
  }

  checkForExistingToken() {
    this.handleToken(sessionStorage.getItem('token'));
  }

  handleLogin() {
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
    return this.http
      .get(`${this.#authApiBase}/token`, { responseType: 'text' })
      .pipe(tap((token) => this.handleToken(token)));
  }

  startLogin(redirectionPath?: string) {
    let href = `${this.#authApiBase}/login?overrideRedirectionUri=${window.location.protocol}//${window.location.host}/${this.transloco.getActiveLang()}/login`;

    if (redirectionPath) href += `?redirectionPath=${redirectionPath}`;
    window.location.href = href;
  }

  logout() {
    this.stopMonitor();

    const isLocalhost = window.location.host.includes('localhost');
    const logoutUrl = isLocalhost
      ? `${this.#authApiBase}/logout?overrideRedirectionUri=${window.location.protocol}//${window.location.host}/${this.transloco.getActiveLang()}`
      : `${this.#authApiBase}/logout`;

    this.http.get<{ redirectionUri: string }>(logoutUrl).subscribe({
      next: () => {
        this.clearToken();
        window.location.assign(
          `${window.location.protocol}//${window.location.host}/${this.transloco.getActiveLang()}`
        );
      },
    });
  }

  private clearToken() {
    sessionStorage.removeItem('token');
    this.store.token.next('');
    this.store.setTokenClaims({});
  }

  handleToken(token: string | null) {
    if (!token) return;

    const decodedToken: EttLoginToken = jwtDecode(token);

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
