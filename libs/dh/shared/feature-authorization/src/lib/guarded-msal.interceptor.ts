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

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Location, DOCUMENT } from '@angular/common';
import { Observable, EMPTY, of } from 'rxjs';
import { switchMap, catchError, filter } from 'rxjs/operators';
import {
  AccountInfo,
  AuthenticationResult,
  BrowserConfigurationAuthError,
  InteractionStatus,
  InteractionType,
  StringUtils,
  UrlString,
} from '@azure/msal-browser';
import { Injectable, Inject, ClassProvider } from '@angular/core';
import {
  MsalBroadcastService,
  MsalInterceptorAuthRequest,
  MsalInterceptorConfiguration,
  ProtectedResourceScopes,
} from '@azure/msal-angular';
import { MsalService, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { MatchingResources } from '@azure/msal-angular/msal.interceptor.config';

@Injectable()
export class GuardedMsalInterceptor implements HttpInterceptor {
  private _document?: Document;

  constructor(
    @Inject(MSAL_INTERCEPTOR_CONFIG)
    private msalInterceptorConfig: MsalInterceptorConfiguration,
    private authService: MsalService,
    private location: Location,
    private msalBroadcastService: MsalBroadcastService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    @Inject(DOCUMENT) document?: any
  ) {
    this._document = document as Document;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, sonarjs/cognitive-complexity
  intercept(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: HttpRequest<any>,
    next: HttpHandler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<HttpEvent<any>> {
    if (
      this.msalInterceptorConfig.interactionType !== InteractionType.Popup &&
      this.msalInterceptorConfig.interactionType !== InteractionType.Redirect
    ) {
      throw new BrowserConfigurationAuthError(
        'invalid_interaction_type',
        'Invalid interaction type provided to MSAL Interceptor. InteractionType.Popup, InteractionType.Redirect must be provided in the msalInterceptorConfiguration'
      );
    }

    this.authService.getLogger().verbose('MSAL Interceptor activated');
    const scopes = this.getScopesForEndpoint(req.url, req.method);

    // If no scopes for endpoint, does not acquire token
    if (!scopes || scopes.length === 0) {
      this.authService
        .getLogger()
        .verbose('Interceptor - no scopes for endpoint');
      return next.handle(req);
    }

    // Sets account as active account or first account
    let account: AccountInfo;
    if (this.authService.instance.getActiveAccount()) {
      this.authService
        .getLogger()
        .verbose('Interceptor - active account selected');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      account = this.authService.instance.getActiveAccount()!;
    } else {
      this.authService
        .getLogger()
        .verbose('Interceptor - no active account, fallback to first account');
      account = this.authService.instance.getAllAccounts()[0];
    }

    const authRequest =
      typeof this.msalInterceptorConfig.authRequest === 'function'
        ? this.msalInterceptorConfig.authRequest(this.authService, req, {
            account: account,
          })
        : { ...this.msalInterceptorConfig.authRequest, account };

    this.authService
      .getLogger()
      .info(`Interceptor - ${scopes.length} scopes found for endpoint`);
    this.authService
      .getLogger()
      .infoPii(`Interceptor - [${scopes}] scopes found for ${req.url}`);

    // Note: For MSA accounts, include openid scope when calling acquireTokenSilent to return idToken
    return this.authService
      .acquireTokenSilent({ ...authRequest, scopes, account })
      .pipe(
        catchError(() => {
          this.authService
            .getLogger()
            .error(
              'Interceptor - acquireTokenSilent rejected with error. Invoking interaction to resolve.'
            );
          return this.acquireTokenInteractively(authRequest, scopes);
        }),
        switchMap((result: AuthenticationResult) => {
          if (!result.accessToken) {
            this.authService
              .getLogger()
              .error(
                'Interceptor - acquireTokenSilent resolved with null access token. Known issue with B2C tenants, invoking interaction to resolve.'
              );
            return this.acquireTokenInteractively(authRequest, scopes);
          }
          return of(result);
        }),
        switchMap((result: AuthenticationResult) => {
          this.authService
            .getLogger()
            .verbose('Interceptor - setting authorization headers');
          const headers = req.headers.set(
            'Authorization',
            `Bearer ${result.accessToken}`
          );

          const requestClone = req.clone({ headers });
          return next.handle(requestClone);
        })
      );
  }

  /**
   * Invoke interaction for the given set of scopes
   * @param authRequest Request
   * @param scopes Array of scopes for the request
   * @returns Result from the interactive request
   */
  private acquireTokenInteractively(
    authRequest: MsalInterceptorAuthRequest,
    scopes: string[]
  ): Observable<AuthenticationResult> {
    return this.msalBroadcastService.inProgress$.pipe(
      filter((x) => x === InteractionStatus.None),
      switchMap(() => {
        if (
          this.msalInterceptorConfig.interactionType === InteractionType.Popup
        ) {
          this.authService
            .getLogger()
            .verbose(
              'Interceptor - error acquiring token silently, acquiring by popup'
            );
          return this.authService.acquireTokenPopup({ ...authRequest, scopes });
        }
        this.authService
          .getLogger()
          .verbose(
            'Interceptor - error acquiring token silently, acquiring by redirect'
          );
        const redirectStartPage = window.location.href;
        this.authService.acquireTokenRedirect({
          ...authRequest,
          scopes,
          redirectStartPage,
        });
        return EMPTY;
      })
    );
  }

  /**
   * Looks up the scopes for the given endpoint from the protectedResourceMap
   * @param endpoint Url of the request
   * @param httpMethod Http method of the request
   * @returns Array of scopes, or null if not found
   *
   */
  private getScopesForEndpoint(
    endpoint: string,
    httpMethod: string
  ): Array<string> | null {
    this.authService
      .getLogger()
      .verbose('Interceptor - getting scopes for endpoint');

    // Ensures endpoints and protected resources compared are normalized
    const normalizedEndpoint = this.location.normalize(endpoint);

    const protectedResourcesArray = Array.from(
      this.msalInterceptorConfig.protectedResourceMap.keys()
    );

    const matchingProtectedResources = this.matchResourcesToEndpoint(
      protectedResourcesArray,
      normalizedEndpoint
    );

    // Check absolute urls of resources first before checking relative to prevent incorrect matching where multiple resources have similar relative urls
    if (matchingProtectedResources.absoluteResources.length > 0) {
      return this.matchScopesToEndpoint(
        this.msalInterceptorConfig.protectedResourceMap,
        matchingProtectedResources.absoluteResources,
        httpMethod
      );
    } else if (matchingProtectedResources.relativeResources.length > 0) {
      return this.matchScopesToEndpoint(
        this.msalInterceptorConfig.protectedResourceMap,
        matchingProtectedResources.relativeResources,
        httpMethod
      );
    }

    return null;
  }

  /**
   * Finds resource endpoints that match request endpoint
   * @param protectedResourcesEndpoints
   * @param endpoint
   * @returns
   */
  private matchResourcesToEndpoint(
    protectedResourcesEndpoints: string[],
    endpoint: string
  ): MatchingResources {
    const matchingResources: MatchingResources = {
      absoluteResources: [],
      relativeResources: [],
    };

    protectedResourcesEndpoints.forEach((key) => {
      // Normalizes and adds resource to matchingResources.absoluteResources if key matches endpoint. StringUtils.matchPattern accounts for wildcards
      const normalizedKey = this.location.normalize(key);
      if (StringUtils.matchPattern(normalizedKey, endpoint)) {
        matchingResources.absoluteResources.push(key);
      }

      // Get url components for relative urls
      const absoluteKey = this.getAbsoluteUrl(key);
      const keyComponents = new UrlString(absoluteKey).getUrlComponents();
      const absoluteEndpoint = this.getAbsoluteUrl(endpoint);
      const endpointComponents = new UrlString(
        absoluteEndpoint
      ).getUrlComponents();

      // Normalized key should include query strings if applicable
      const relativeNormalizedKey = keyComponents.QueryString
        ? `${keyComponents.AbsolutePath}?${keyComponents.QueryString}`
        : this.location.normalize(keyComponents.AbsolutePath);

      // Add resource to matchingResources.relativeResources if same origin, relativeKey matches endpoint, and is not empty
      if (
        keyComponents.HostNameAndPort === endpointComponents.HostNameAndPort &&
        StringUtils.matchPattern(relativeNormalizedKey, absoluteEndpoint) &&
        relativeNormalizedKey !== '' &&
        relativeNormalizedKey !== '/*'
      ) {
        matchingResources.relativeResources.push(key);
      }
    });

    return matchingResources;
  }

  /**
   * Transforms relative urls to absolute urls
   * @param url
   * @returns
   */
  private getAbsoluteUrl(url: string): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const link = this._document!.createElement('a');
    link.href = url;
    return link.href;
  }

  /**
   * Finds scopes from first matching endpoint with HTTP method that matches request
   * @param protectedResourceMap Protected resource map
   * @param endpointArray Array of resources that match request endpoint
   * @param httpMethod Http method of the request
   * @returns
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  private matchScopesToEndpoint(
    protectedResourceMap: Map<
      string,
      Array<string | ProtectedResourceScopes> | null
    >,
    endpointArray: string[],
    httpMethod: string
  ): Array<string> | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allMatchedScopes: any[] = [];

    // Check each matched endpoint for matching HttpMethod and scopes
    endpointArray.forEach((matchedEndpoint) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scopesForEndpoint: any[] = [];
      const methodAndScopesArray = protectedResourceMap.get(matchedEndpoint);

      // Return if resource is unprotected
      if (methodAndScopesArray === null) {
        allMatchedScopes.push(null);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      methodAndScopesArray!.forEach((entry) => {
        // Entry is either array of scopes or ProtectedResourceScopes object
        if (typeof entry === 'string') {
          scopesForEndpoint.push(entry);
        } else {
          // Ensure methods being compared are normalized
          const normalizedRequestMethod = httpMethod.toLowerCase();
          const normalizedResourceMethod = entry.httpMethod.toLowerCase();
          // Method in protectedResourceMap matches request http method
          if (normalizedResourceMethod === normalizedRequestMethod) {
            // Validate if scopes comes null to unprotect the resource in a certain http method
            if (entry.scopes === null) {
              allMatchedScopes.push(null);
            } else {
              entry.scopes.forEach((scope) => {
                scopesForEndpoint.push(scope);
              });
            }
          }
        }
      });

      // Only add to all scopes if scopes for endpoint and method is found
      if (scopesForEndpoint.length > 0) {
        allMatchedScopes.push(scopesForEndpoint);
      }
    });

    if (allMatchedScopes.length > 0) {
      if (allMatchedScopes.length > 1) {
        this.authService
          .getLogger()
          .warning(
            'Interceptor - More than 1 matching scopes for endpoint found.'
          );
      }
      // Returns scopes for first matching endpoint
      return allMatchedScopes[0];
    }

    return null;
  }
}

export const guardedMsalInterceptor: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: GuardedMsalInterceptor,
};
