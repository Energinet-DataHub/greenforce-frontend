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
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  NgModule,
} from '@angular/core';
import { eoEmissionsRoutePath } from '@energinet-datahub/eo-emissions-routing';
import { EoLogOutStore } from '@energinet-datahub/eo/auth/data-access-security';
import { eoConsumptionPageRoutePath } from '@energinet-datahub/eo/consumption-page/routing';
import { eoDashboardRoutePath } from '@energinet-datahub/eo/dashboard/routing';
import { eoFaqRoutePath } from '@energinet-datahub/eo/faq/routing';
import { eoMeteringPointsRoutePath } from '@energinet-datahub/eo/metering-points/routing';
import { eoOriginOfEnergyRoutePath } from '@energinet-datahub/eo/origin-of-energy/routing';
import { eoProductionRoutePath } from '@energinet-datahub/eo/production/routing';
import {
  WattNavListComponent,
  WattNavListItemComponent,
} from '@energinet-datahub/watt/shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-primary-navigation',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <watt-nav-list>
      <watt-nav-list-item link="/${eoDashboardRoutePath}">
        Dashboard
      </watt-nav-list-item>
      <watt-nav-list-item link="/${eoOriginOfEnergyRoutePath}">
        Renewable Share
      </watt-nav-list-item>
      <watt-nav-list-item link="/${eoEmissionsRoutePath}">
        Emissions
      </watt-nav-list-item>
      <watt-nav-list-item link="/${eoConsumptionPageRoutePath}">
        Consumption
      </watt-nav-list-item>
      <watt-nav-list-item link="/${eoProductionRoutePath}">
        Production
      </watt-nav-list-item>
      <watt-nav-list-item link="/${eoMeteringPointsRoutePath}">
        Metering Points
      </watt-nav-list-item>
      <watt-nav-list-item link="/${eoFaqRoutePath}">FAQ</watt-nav-list-item>
      <watt-nav-list-item (click)="onLogOut()" role="link">
        Log out
      </watt-nav-list-item>
    </watt-nav-list>
  `,
  viewProviders: [EoLogOutStore],
})
export class EoPrimaryNavigationComponent {
  @HostBinding('attr.aria-label')
  get ariaLabelAttribute(): string {
    return 'Menu';
  }

  constructor(private store: EoLogOutStore) {}

  onLogOut(): void {
    this.store.onLogOut();
  }
}

@NgModule({
  declarations: [EoPrimaryNavigationComponent],
  exports: [EoPrimaryNavigationComponent],
  imports: [WattNavListComponent, WattNavListItemComponent],
})
export class EoPrimaryNavigationScam {}
