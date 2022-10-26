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
import { MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import {
  DhB2CEnvironment,
  dhB2CEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';
import { filter } from 'rxjs';

const scopesKey = 'actor-scopes';
const scopeKey = 'active-actor-scope';

@Injectable({ providedIn: 'root' })
export class ScopeService {
  constructor(
    @Inject(dhB2CEnvironmentToken) private config: DhB2CEnvironment,
    private msalBroadcastService: MsalBroadcastService
  ) {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
        )
      )
      .subscribe((msg) => {
        // console.log(msg);
        const claims = (msg.payload as any).idTokenClaims;
        console.log('Claims:', claims);

        const actorScopes = claims['extn.actors'];
        console.log('ActorScopes:', actorScopes);

        this.setScopes(actorScopes ? actorScopes[0].split(' ') : []);
        if (actorScopes) {
          const scope = actorScopes[0];
          if (scope) {
            console.log('A');
            this.setActiveScope(scope);
          }
        }
      });
  }

  public setScopes(scope: string[]) {
    localStorage.setItem(scopesKey, scope.join(','));
  }

  public getScopes() {
    return localStorage.getItem(scopesKey)?.split(',') ?? [];
  }

  public setActiveScope(scope: string) {
    localStorage.setItem(scopeKey, scope);
  }

  public getActiveScope() {
    const scope = localStorage.getItem(scopeKey) ?? '';
    console.log(scope);
    return scope;
  }
}
