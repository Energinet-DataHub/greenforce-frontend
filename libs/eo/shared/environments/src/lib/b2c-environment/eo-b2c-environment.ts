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
import { InjectionToken, PLATFORM_ID } from '@angular/core';
import { eoLocalB2cEnvironment } from '@energinet-datahub/eo/shared/assets';

import { environment } from '../environment';
import { isPlatformBrowser } from '@angular/common';

export interface EoB2cEnvironment {
  readonly issuer: string;
  readonly client_id: string;
}

export interface EoB2cSettings {
  readonly 'azure-b2c': EoB2cEnvironment;
}

export const eoB2cEnvironmentToken = new InjectionToken<EoB2cEnvironment>('eoB2cEnvironmentToken', {
  factory: (): EoB2cEnvironment => {
    if (environment.production && isPlatformBrowser(PLATFORM_ID)) {
      throw new Error('No Energy Origin B2c environment provided.');
    }

    // Used for unit and integration tests
    return eoLocalB2cEnvironment['azure-b2c'];
  },
  providedIn: 'platform',
});
