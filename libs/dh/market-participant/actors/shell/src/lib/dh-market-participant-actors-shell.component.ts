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
import { DhMarketRolesOverviewComponent } from '@energinet-datahub/dh/market-participant/actors/feature-market-roles';
import { DhActorsOverviewComponent } from '@energinet-datahub/dh/market-participant/actors/feature-actors';
import { DhOrganizationsOverviewComponent } from '@energinet-datahub/dh/market-participant/actors/feature-organizations';

@Component({
  selector: 'dh-market-participant-actors-shell',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.actors.tabs'">
      <watt-tabs>
        <watt-tab [label]="t('actors.tabLabel')">
          <dh-actors-overview />
        </watt-tab>

        <watt-tab [label]="t('organizations.tabLabel')">
          <dh-organizations-overview />
        </watt-tab>

        <watt-tab [label]="t('marketRoles.tabLabel')">
          <dh-market-roles-overview />
        </watt-tab>
      </watt-tabs>
    </ng-container>
  `,
  imports: [
    TranslocoDirective,

    WATT_TABS,
    DhActorsOverviewComponent,
    DhOrganizationsOverviewComponent,
    DhMarketRolesOverviewComponent,
  ],
})
export class DhMarketParticipantActorsShellComponent {}
