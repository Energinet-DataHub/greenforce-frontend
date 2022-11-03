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

import { Inject, Injectable } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
} from '@azure/msal-browser';
import {
  DhB2CEnvironment,
  dhB2CEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { filter } from 'rxjs';
import { ScopeStorage, scopeStorageToken } from './scope-storage';

export const actorScopesKey = 'actor-scopes';
export const activeActorScopeKey = 'active-actor-scope';
export const actorScopesClaimsKey = 'extn.actors';

@Injectable({ providedIn: 'root' })
export class ScopeService {
  localAccountId = '';

  constructor(
    @Inject(dhB2CEnvironmentToken) private config: DhB2CEnvironment,
    private msalBroadcastService: MsalBroadcastService,
    private authService: MsalService,
    private featureFlagService: DhFeatureFlagsService,
    @Inject(scopeStorageToken) private scopeStorage: ScopeStorage
  ) {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
        )
      )
      .subscribe((e: EventMessage) => {
        const payload = e.payload as AuthenticationResult;
        const account = payload.account;

        if (!account) {
          this.clearScopeRelatedItems();
          return;
        }

        this.localAccountId = account.localAccountId;
        this.authService.instance.setActiveAccount(account);

        const userId = account.localAccountId;
        const actors =
          account.idTokenClaims &&
          (account.idTokenClaims[actorScopesClaimsKey] as string[]);
        const scopes = this.getActorClaims(actors);

        this.scopeStorage.setItem(userId + actorScopesKey, scopes.join(' '));
      });
  }

  public getActiveScope() {
    if (!this.localAccountId) return this.fallbackScope();

    const scopes = this.getScopes(this.localAccountId);
    if (scopes.length === 0) return this.fallbackScope();

    const stored = this.scopeStorage.getItem(
      this.localAccountId + activeActorScopeKey
    );
    if (stored && scopes.includes(stored)) return stored;

    const activeScope = scopes[0];
    this.scopeStorage.setItem(
      this.localAccountId + activeActorScopeKey,
      activeScope
    );

    return activeScope;
  }

  private getScopes(userId: string) {
    const scopes = this.scopeStorage.getItem(userId + actorScopesKey);
    return (scopes && scopes.split(' ')) || [];
  }

  private getActorClaims(scopesString?: string[]) {
    return scopesString && scopesString.length > 0
      ? scopesString[0].split(' ')
      : [];
  }

  private clearScopeRelatedItems() {
    const keys = [];

    for (let i = 0, l = this.scopeStorage.length; i < l; ++i) {
      const key = this.scopeStorage.key(i);
      if (
        key &&
        (key.endsWith(activeActorScopeKey) || key.endsWith(actorScopesKey))
      ) {
        keys.push(key);
      }
    }

    keys.forEach(this.scopeStorage.removeItem);
  }

  private fallbackScope() {
    return this.featureFlagService.isEnabled('grant_full_authorization')
      ? this.config.clientId
      : '';
  }
}
