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

import { InjectionToken } from '@angular/core';

export class ScopeStorage {
  private readonly actorScopesKey = '.actor-scopes';
  private readonly activeActorScopeKey = '.active-actor-scope';

  constructor(private localStorage: Storage) {}

  public readonly setScopes = (key: string, value: string) => {
    this.localStorage.setItem(key + this.actorScopesKey, value);
  };

  public readonly setActiveScope = (key: string, value: string) => {
    this.localStorage.setItem(key + this.activeActorScopeKey, value);
  };

  public readonly getScopes = (key: string) => {
    return this.localStorage.getItem(key + this.actorScopesKey);
  };

  public readonly getActiveScope = (key: string) => {
    return this.localStorage.getItem(key + this.activeActorScopeKey);
  };

  public readonly clearAllScopes = () => {
    const keys = [];

    for (let i = 0, l = this.localStorage.length; i < l; ++i) {
      const key = this.localStorage.key(i);
      if (
        key &&
        (key.endsWith(this.activeActorScopeKey) ||
          key.endsWith(this.actorScopesKey))
      ) {
        keys.push(key);
      }
    }

    keys.forEach(this.localStorage.removeItem);
  };
}

export const scopeStorageToken = new InjectionToken<ScopeStorage>(
  'scopeStorageToken',
  {
    factory: (): ScopeStorage => new ScopeStorage(localStorage),
  }
);
