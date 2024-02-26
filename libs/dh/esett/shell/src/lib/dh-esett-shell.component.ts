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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { DhOutgoingMessagesComponent } from '@energinet-datahub/dh/esett/feature-outgoing-messages';
import { DhMeteringGridAreaImbalanceComponent } from '@energinet-datahub/dh/esett/feature-metering-gridarea-imbalance';
import { DhBalanceResponsibleComponent } from '@energinet-datahub/dh/esett/feature-balance-responsible';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  selector: 'dh-esett-shell',
  standalone: true,
  template: `<watt-tabs *transloco="let t; read: 'eSett.tabs'">
    <watt-tab [label]="t('outgoingMessages.tabLabel')">
      <dh-outgoing-messages />
    </watt-tab>

    <watt-tab [label]="t('meteringGridareaImbalance.tabLabel')">
      @defer (on viewport) {
        <dh-metering-gridarea-imbalance />
      } @placeholder {
        <watt-spinner />
      }
    </watt-tab>

    <watt-tab [label]="t('balanceResponsible.tabLabel')">
      @defer (on viewport) {
        <dh-balance-responsible />
      } @placeholder {
        <watt-spinner />
      }
    </watt-tab>
  </watt-tabs>`,
  imports: [
    TranslocoDirective,

    WATT_TABS,
    WattSpinnerComponent,

    DhOutgoingMessagesComponent,
    DhMeteringGridAreaImbalanceComponent,
    DhBalanceResponsibleComponent,
  ],
})
export class DhESettShellComponent {}
