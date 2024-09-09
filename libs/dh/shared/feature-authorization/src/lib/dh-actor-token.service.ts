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
import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { tapResponse } from '@ngrx/operators';
import { MsalService } from '@azure/msal-angular';
import { map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';

import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

import { DhActorStorage } from './dh-actor-storage';

type CachedEntry = { token: string; value: Observable<string> } | undefined;

@Injectable({
  providedIn: 'root',
})
export class DhActorTokenService {
  private internalActors: CachedEntry;
  private internalToken: CachedEntry;
  private actorStorage = inject(DhActorStorage);
  private msalService = inject(MsalService);
  private apiToken = inject(dhApiEnvironmentToken);
  private httpClient = inject(HttpClient);
  private appInsights = inject(DhApplicationInsights);

  private logoutInProgress = false;

  public isPartOfAuthFlow(request: HttpRequest<unknown>) {
    return this.isUserActorsRequest(request) || this.isTokenRequest(request);
  }

  public handleAuthFlow(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.isUserActorsRequest(request)) {
      return this.updateCache(
        request,
        nextHandler,
        () => this.internalActors,
        (value) => (this.internalActors = value)
      );
    }

    if (this.isTokenRequest(request)) {
      return this.updateCache(
        request,
        nextHandler,
        () => this.internalToken,
        (value) => (this.internalToken = value)
      );
    }

    return nextHandler.handle(request);
  }

  public acquireToken = (): Observable<string> => {
    return this.httpClient
      .get<{ actorIds: [] }>(`${this.apiToken.apiBase}${this.apiToken.getUserActorsUrl}`)
      .pipe(
        tap(({ actorIds }) => this.actorStorage.setUserAssociatedActors(actorIds)),
        switchMap(() =>
          this.httpClient
            .post<{
              token: string;
            }>(
              `${this.apiToken.apiBase}${this.apiToken.getTokenUrl}?actorId=${this.actorStorage.getSelectedActorId()}`,
              null
            )
            .pipe(
              tapResponse(
                () => {
                  const account = this.msalService.instance.getActiveAccount();
                  if (account?.idTokenClaims) {
                    const givenName = account?.idTokenClaims['given_name'];
                    if (!givenName) {
                      localStorage.setItem('mitIdRelogin', 'true');
                      this.msalService.instance.logout();
                    }
                  }
                },
                // Error callback called for every failed request to the token endpoint
                // Happens when:
                // 1. a non-DataHub user tries to login with MitID
                () => {
                  // Prevent multiple logs of the same event in AppInsights
                  if (this.logoutInProgress === false) {
                    this.appInsights.trackEvent('Failed login by non-DataHub user');
                    this.appInsights.flush();

                    // Delay redirect to logout so AppInsights has a chance to flush
                    setTimeout(() => this.msalService.instance.logout(), 2_000);

                    this.logoutInProgress = true;
                  }
                }
              ),
              map(({ token }) => token)
            )
        )
      );
  };

  private updateCache(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler,
    readCache: () => CachedEntry,
    writeCache: (value: CachedEntry) => void
  ): Observable<HttpEvent<unknown>> {
    const externalToken = request.headers.get('Authorization');

    if (!externalToken) throw new Error('handleAuthFlow failed, no token in Authorization header.');

    const cachedEntry = readCache();
    if (cachedEntry && cachedEntry.token === externalToken) {
      return this.createCachedResponse(cachedEntry.value);
    }

    const subject = new ReplaySubject<string>();
    writeCache({ token: externalToken, value: subject });

    return nextHandler.handle(request).pipe(
      tap({
        next: (event) => {
          const response = event as HttpResponse<string>;
          if (response.status === 200 && response.body) {
            subject.next(response.body);
            subject.complete();
          }
        },
        error: (error) => {
          subject.error(error);
        },
      })
    );
  }

  private createCachedResponse(cache: Observable<string>): Observable<HttpResponse<string>> {
    return cache.pipe(map((value) => new HttpResponse<string>({ body: value, status: 200 })));
  }

  private isUserActorsRequest(request: HttpRequest<unknown>): boolean {
    return request.url.endsWith(this.apiToken.getUserActorsUrl);
  }

  private isTokenRequest(request: HttpRequest<unknown>): boolean {
    return request.url.includes(this.apiToken.getTokenUrl);
  }
}
