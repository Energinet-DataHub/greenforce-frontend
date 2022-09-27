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
import { MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG, MsalGuardAuthRequest } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { map } from 'rxjs';
import { Permission } from './permissions';

@Injectable()
export class PermissionService {
  constructor(private authService: MsalService, @Inject(MSAL_GUARD_CONFIG) private config: MsalGuardConfiguration) {}

  private obtainToken() {

    const accounts = this.authService.instance.getAllAccounts();

     // TODO: Use this for 'roles' claims.
    console.log(accounts[0].idTokenClaims)

    // TODO: Use this for 'scope' claims.
    const scopes = (this.config.authRequest as MsalGuardAuthRequest).scopes || [];
    const request: SilentRequest = {
      scopes: scopes, // '88e5d356-0c71-49e9-b260-d0629f3c0445'
      account: accounts[0]
    };

    return this.authService.acquireTokenSilent(request);
  }

  public hasPermission(permission: Permission | undefined) {
    return this.obtainToken().pipe(
      map((authResult) => {
        console.log("Requested permission: ", permission);
        console.log('fromCache: ', authResult.fromCache);
        return !!permission; // authResult.scopes.includes(permission);
      })
    );
  }
}
