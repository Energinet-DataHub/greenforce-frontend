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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { InstallationAddress } from '../../types';
import { CustomerContactDto } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-address',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      {{ address().streetName }}
      {{ address().buildingNumber }},

      @if (address().floor || address().room) {
        {{ address().floor }} {{ address().room }}
      }
    </div>
    <div class="watt-space-stack-s">
      {{ address().postCode }}
      {{ address().cityName }}
    </div>
    <div class="watt-space-stack-s">
      {{ address().countryCode }}
    </div>
  `,
})
export class DhAddressComponent {
  address = input.required<InstallationAddress | CustomerContactDto>();
}
