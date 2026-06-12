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
import { inject, Injectable, InjectionToken, Provider } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

/** Key used to store the router URL in the history state object. */
export const ROUTER_URL_KEY = '__dhRouterUrl__';

/**
 * Marker used in the address bar to indicate a redacted path segment.
 * Chosen because `~` is RFC 3986 unreserved (never percent-encoded) and
 * very uncommon in real application URLs.
 */
export const REDACTED_SEGMENT = '~';
export const REDACTION_PATTERNS = new InjectionToken<string[]>('REDACTION_PATTERNS');

const normalizeState = (state: unknown) => (state as Record<string, unknown>) ?? {};
const normalizeQueryParams = (params: string) =>
  params && params[0] !== '?' ? `?${params}` : params;

/**
 * A custom LocationStrategy that stores the route URL's in history state.
 *
 * @usageNotes
 * ```typescript
 * import { provideStateLocationStrategy } from '@energinet-datahub/dh/core/configuration-routing';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStateLocationStrategy(),
 *     ...
 *   ],
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class StateLocationStrategy extends PathLocationStrategy {
  private readonly patterns = inject(REDACTION_PATTERNS);

  override path(includeHash = false) {
    const state = normalizeState(this.getState());
    const url = state[ROUTER_URL_KEY];
    if (typeof url === 'string') return !includeHash ? url.split('#')[0] : url;
    const path = super.path(includeHash);
    return path.split(/[/?#]/).includes(REDACTED_SEGMENT) ? '/' : path;
  }

  override prepareExternalUrl(internal: string): string {
    return super.prepareExternalUrl(this.redactUrl(internal));
  }

  override pushState(state: unknown, title: string, url: string, queryParams: string) {
    super.pushState(this.withRouterUrl(state, url, queryParams), title, url, queryParams);
  }

  override replaceState(state: unknown, title: string, url: string, queryParams: string) {
    super.replaceState(this.withRouterUrl(state, url, queryParams), title, url, queryParams);
  }

  private withRouterUrl(state: unknown, url: string, queryParams: string) {
    return {
      ...normalizeState(state),
      [ROUTER_URL_KEY]: url + normalizeQueryParams(queryParams),
    };
  }

  private redactUrl(url: string) {
    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern);
      if (!regex.test(url)) continue;
      return url.replace(regex, (match, group) => match.replace(group, REDACTED_SEGMENT));
    }

    return url;
  }
}

/**
 * Provides the StateLocationStrategy as the LocationStrategy for the application.
 */
export const provideStateLocationStrategy = (patterns?: string[]): Provider[] => [
  { provide: REDACTION_PATTERNS, useValue: patterns ?? [] },
  { provide: LocationStrategy, useClass: StateLocationStrategy },
];
