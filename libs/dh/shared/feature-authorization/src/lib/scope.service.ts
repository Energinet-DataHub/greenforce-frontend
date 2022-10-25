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
import {
  DhB2CEnvironment,
  dhB2CEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';

@Injectable({ providedIn: 'root' })
export class ScopeService {
  constructor(
    @Inject(dhB2CEnvironmentToken) private config: DhB2CEnvironment,
    private msalBroadcastService: MsalBroadcastService
  ) {

    // Lytte på login // /auth
    // SÆT aktiv scope
    // /token
    // Done

  }

  public getActiveScope() {

    // Throw exception if no scope at all. That is sus.

    return this.config.clientId;
  }
}
