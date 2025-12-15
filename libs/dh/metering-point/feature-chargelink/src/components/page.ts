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
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';
import { WATT_SEGMENTED_BUTTONS } from '@energinet/watt/segmented-buttons';

import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';

import { ChargeLinksSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

@Component({
  selector: 'dh-metering-point-charge-links',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    TranslocoDirective,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WATT_SEGMENTED_BUTTONS,
  ],
  template: `
    <vater-flex
      inset="ml"
      gap="ml"
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.navigation'"
    >
      <vater-stack>
        <watt-segmented-buttons>
          <watt-segmented-button [link]="getLink('tariff-and-subscription')">
            {{ t('tariffAndSubscription') }}
          </watt-segmented-button>
          <watt-segmented-button [link]="getLink('fees')">{{ t('fees') }}</watt-segmented-button>
        </watt-segmented-buttons>
      </vater-stack>

      <vater-flex fill="vertical">
        <router-outlet />
      </vater-flex>
    </vater-flex>
  `,
})
export default class DhMeteringPointChargeLinkPage {
  getLink = (key: ChargeLinksSubPaths) => getPath(key);
}
