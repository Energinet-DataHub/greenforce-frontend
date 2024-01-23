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
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { eoDashboardPeriod } from '@energinet-datahub/eo/dashboard/domain';
import { EoAggregateService } from '@energinet-datahub/eo/wallet/data-access-api';
import { EoDashboardChoosePeriodComponent } from './eo-dashboard-choose-period.component';
import { EoDashboardConsumptionComponent } from './eo-dashboard-consumption.component';
import { EoDashboardProductionTransferredComponent } from './eo-dashboard-production-transferred.component';
import { EoMeteringPointsStore } from '@energinet-datahub/eo/metering-points/data-access-api';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: var(--watt-space-m);
        @include watt.media('>=Large') {
          gap: var(--watt-space-l);
        }
      }

      .loading-container {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  imports: [
    EoDashboardConsumptionComponent,
    EoDashboardProductionTransferredComponent,
    EoDashboardChoosePeriodComponent,
    NgIf,
    AsyncPipe,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    JsonPipe,
    WattTabsComponent,
    WattTabComponent,
  ],
  selector: 'eo-dashboard-shell',
  template: `
    @if ((isLoadingMeteringPoints$ | async) === false) {
      <watt-tabs variant="secondary">
        @if (productionMeteringPoints$ | async) {
          <watt-tab label="Production">
            <eo-dashboard-production-transferred [period]="period()" />
          </watt-tab>
        }

        @if (consumptionMeteringPoints$ | async) {
          <watt-tab label="Consumption">
            <eo-dashboard-consumption [period]="period()" />
          </watt-tab>
        }

        <eo-dashboard-choose-period (periodChanged)="onPeriodChanged($event)" />
      </watt-tabs>

      @if ((productionAndConsumptionMeteringPoints$ | async)?.length === 0) {
        <watt-empty-state
          icon="custom-power"
          title="No data to visualize"
          message="We have no data to visualize because you have no production or consumption metering point(s). "
        />
      }

      @if ((meteringPointError$ | async) !== null) {
        <watt-empty-state
          icon="custom-power"
          title="An unexpected error occured"
          message="Try again by reloading the page or contacting your system administrator if you keep getting this error."
        />
      }
    } @else {
      <div class="loading-container">
        <watt-spinner />
      </div>
    }
  `,
})
export class EoDashboardShellComponent implements OnInit {
  private meteringPointStore = inject(EoMeteringPointsStore);
  private aggregateService: EoAggregateService = inject(EoAggregateService);

  period = signal<eoDashboardPeriod>(null);
  isLoadingMeteringPoints$ = this.meteringPointStore.loading$;
  productionMeteringPoints$ = this.meteringPointStore.productionMeteringPoints$;
  consumptionMeteringPoints$ = this.meteringPointStore.consumptionMeteringPoints$;
  productionAndConsumptionMeteringPoints$ =
    this.meteringPointStore.productionAndConsumptionMeteringPoints$;
  meteringPointError$ = this.meteringPointStore.meteringPointError$;

  ngOnInit(): void {
    this.meteringPointStore.loadMeteringPoints();
    this.aggregateService.clearCache();
  }

  protected onPeriodChanged(period: eoDashboardPeriod): void {
    this.period.set(period);
  }
}
