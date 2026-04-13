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
import { inject, Injectable, Provider } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import {
  DhAppEnvironment,
  DhAppEnvironmentConfig,
  dhAppEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';

/** Key used to store the router URL in the history state object. */
export const ROUTER_URL_KEY = '__dhRouterUrl__';

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
 *     provideRouter(routes),
 *   ],
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class StateLocationStrategy extends PathLocationStrategy {
  override path(includeHash = false) {
    const state = normalizeState(this.getState());
    const url = state[ROUTER_URL_KEY];
    if (typeof url !== 'string') return super.path(includeHash);

    return !includeHash ? url.split('#')[0] : url;
  }

  override prepareExternalUrl() {
    return this.getBaseHref();
  }

  override pushState(state: unknown, title: string, url: string, queryParams: string) {
    super.pushState(this.withRouterUrl(state, url, queryParams), title, '', '');
  }

  override replaceState(state: unknown, title: string, url: string, queryParams: string) {
    super.replaceState(this.withRouterUrl(state, url, queryParams), title, '', '');
  }

  private withRouterUrl(state: unknown, url: string, queryParams: string) {
    return {
      ...normalizeState(state),
      [ROUTER_URL_KEY]: url + normalizeQueryParams(queryParams),
    };
  }
}

/** Provides the StateLocationStrategy as the LocationStrategy for the application. */
export const provideStateLocationStrategy = (): Provider => ({
  provide: LocationStrategy,
  useFactory: ({ current }: DhAppEnvironmentConfig) => {
    if (current === DhAppEnvironment.local) {
      // return inject(PathLocationStrategy);
    }

    return inject(StateLocationStrategy);
  },
  deps: [dhAppEnvironmentToken],
});
