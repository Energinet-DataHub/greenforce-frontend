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
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { TranslocoDirective } from '@ngneat/transloco';
import { DhWholesaleSettlementsReportsTabsBalanceComponent } from './tabs/dh-wholesale-settlements-reports-tabs-balance.component';

@Component({
  standalone: true,
  selector: 'dh-wholesale-settlements-reports-tab',
  templateUrl: './dh-wholesale-settlements-reports-tab.component.html',
  styleUrls: ['./dh-wholesale-settlements-reports-tab.component.scss'],
  imports: [
    TranslocoDirective,

    WATT_TABS,
    WATT_CARD,
    WattButtonComponent,

    DhWholesaleSettlementsReportsTabsBalanceComponent,
  ],
})
export class DhWholesaleSettlementsReportsTabComponent {}
