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
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import {
  DhB2CEnvironment,
  dhB2CEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { map, of, switchMap } from 'rxjs';
import { ActorTokenService } from './actor-token.service';
import { Permission } from './permission';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(
    @Inject(dhB2CEnvironmentToken) private config: DhB2CEnvironment,
    private actorTokenService: ActorTokenService,
    private authService: MsalService,
    private featureFlag: DhFeatureFlagsService
  ) {}

  public hasPermission(permission: Permission) {
    if (this.featureFlag.isEnabled('grant_full_authorization')) {
      return of(true);
    }

    const accounts = this.authService.instance.getAllAccounts();

    // we expect one and only one account for now.
    if (accounts.length != 1) {
      return of(false);
    }

    const account = accounts[0];

    const tokenRequest: SilentRequest = {
      scopes: [this.config.backendId || this.config.clientId],
      account: account,
    };

    return this.authService.acquireTokenSilent(tokenRequest).pipe(
      switchMap((authResult) => {
        return this.actorTokenService.acquireToken(authResult.accessToken);
      }),
      map((internalToken) => {
        const roles = this.acquireClaimsFromAccessToken(internalToken);
        return roles.includes(permission);
      })
    );
  }

  private acquireClaimsFromAccessToken(accessToken: string): Permission[] {
    const jwtParts = accessToken.split('.');
    const jwtPayload = jwtParts[1];

    const claims = window.atob(jwtPayload);

    const jwtJson = JSON.parse(claims);
    const roles = jwtJson['role'] as Permission[];

    return roles || [];
  }
}
