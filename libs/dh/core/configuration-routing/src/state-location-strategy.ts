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
import {
  inject,
  Injectable,
  DestroyRef,
  EnvironmentProviders,
  Provider,
  provideAppInitializer,
} from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, RoutesRecognized, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** Key used to store the router URL in the history state object. */
export const ROUTER_URL_KEY = '__dhRouterUrl__';

/**
 * Marker used in the address bar to indicate a redacted path segment.
 * Chosen because `~` is RFC 3986 unreserved (never percent-encoded) and
 * very uncommon in real application URLs.
 */
export const REDACTED_SEGMENT = '~';

const normalizeState = (state: unknown) => (state as Record<string, unknown>) ?? {};
const normalizeQueryParams = (params: string) =>
  params && params[0] !== '?' ? `?${params}` : params;

/**
 * Walks the activated route snapshot and collects the values of params
 * belonging to routes marked with `data: { sensitiveParams: true }`.
 *
 * Only the route directly carrying the flag contributes its own param
 * values; literal path segments are left alone. Note that when the router
 * is configured with `paramsInheritanceStrategy: 'always'`, the flag is
 * inherited by descendants — so marking a parent will cause every nested
 * `:param` below it to be collected as sensitive too.
 */
const collectSensitiveValues = (
  node: ActivatedRouteSnapshot,
  out = new Set<string>()
): Set<string> => {
  if (node.data['sensitiveParams'] && node.routeConfig?.path) {
    node.routeConfig.path.split('/').forEach((seg, i) => {
      if (seg.startsWith(':') && node.url[i]) out.add(node.url[i].path);
    });
  }
  node.children.forEach((child) => collectSensitiveValues(child, out));
  return out;
};

/**
 * A custom LocationStrategy that stores route URLs in history state and
 * redacts sensitive path segments in the address bar.
 *
 * Routes opt in by adding `data: { sensitiveParams: true }` to their config.
 * Their parameter values are replaced with `~` in the browser URL while
 * the real URL is preserved in `history.state` for back/forward navigation.
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
  private sensitiveValues = new Set<string>();

  setSensitiveValues(values: Set<string>) {
    this.sensitiveValues = values;
  }

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

  private redactUrl(url: string): string {
    if (this.sensitiveValues.size === 0) return url;
    const queryIndex = url.search(/[?#]/);
    const path = queryIndex < 0 ? url : url.slice(0, queryIndex);
    const tail = queryIndex < 0 ? '' : url.slice(queryIndex);
    return (
      path
        .split('/')
        .map((seg) => (this.sensitiveValues.has(decodeURIComponent(seg)) ? REDACTED_SEGMENT : seg))
        .join('/') + tail
    );
  }
}

/**
 * Provides the StateLocationStrategy as the LocationStrategy for the application.
 *
 * Routes opt in to URL redaction by adding `data: { sensitiveParams: true }`
 * to their route configuration. Their parameter values will be replaced with
 * `~` in the browser address bar while the real URL stays in `history.state`.
 */
export const provideStateLocationStrategy = (): (Provider | EnvironmentProviders)[] => [
  { provide: LocationStrategy, useClass: StateLocationStrategy },
  provideAppInitializer(() => {
    const router = inject(Router);
    const strategy = inject(LocationStrategy) as StateLocationStrategy;
    const destroyRef = inject(DestroyRef);

    router.events
      .pipe(
        filter((e): e is RoutesRecognized => e instanceof RoutesRecognized),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe((e) => strategy.setSensitiveValues(collectSensitiveValues(e.state.root)));
  }),
];
