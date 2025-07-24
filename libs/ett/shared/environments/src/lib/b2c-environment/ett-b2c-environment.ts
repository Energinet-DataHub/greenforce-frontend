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
import { InjectionToken, PLATFORM_ID } from '@angular/core';
import { ettLocalB2cEnvironment } from '@energinet-datahub/ett/shared/assets';

import { environment } from '../environment';
import { isPlatformBrowser } from '@angular/common';

export interface EttB2cEnvironment {
  readonly issuer: string;
  readonly client_id: string;
}

export interface EttB2cSettings {
  readonly 'azure-b2c': EttB2cEnvironment;
}

export const ettB2cEnvironmentToken = new InjectionToken<EttB2cEnvironment>(
  'ettB2cEnvironmentToken',
  {
    factory: (): EttB2cEnvironment => {
      if (environment.production && isPlatformBrowser(PLATFORM_ID)) {
        throw new Error('No Energy Track and Trace B2c environment provided.');
      }

      // Used for unit and integration tests
      return ettLocalB2cEnvironment['azure-b2c'];
    },
    providedIn: 'platform',
  }
);
