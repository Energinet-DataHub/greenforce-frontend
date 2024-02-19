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
  DestroyRef,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { eoDashboardPeriod } from '@energinet-datahub/eo/dashboard/domain';
import { EoAggregateService } from '@energinet-datahub/eo/wallet/data-access-api';
import { EoDashboardChoosePeriodComponent } from './eo-dashboard-choose-period.component';
import { EoDashboardConsumptionComponent } from './eo-dashboard-consumption.component';
import { EoDashboardProductionTransferredComponent } from './eo-dashboard-production-transferred.component';
import { EoMeteringPointsStore } from '@energinet-datahub/eo/metering-points/data-access-api';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { TranslocoPipe } from '@ngneat/transloco';

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

      eo-dashboard-choose-period {
        margin-top: var(--watt-space-s);
        @include watt.media('>=Large') {
          margin-top: 0;
        }
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
    WattTabsComponent,
    WattTabComponent,
    TranslocoPipe,
  ],
  selector: 'eo-dashboard-shell',
  template: `
    @if ((isLoadingMeteringPoints$ | async) === false) {
      @if (((productionAndConsumptionMeteringPoints$ | async) || []).length > 0) {
        <watt-tabs variant="secondary">
          @if (((productionMeteringPoints$ | async) || []).length > 0) {
            <watt-tab [label]="'dashboard.tabs.producer' | transloco" (changed)="activeTab = 'production'">
              @if (activeTab === 'production') {
                <eo-dashboard-production-transferred [period]="period()" />
              }
            </watt-tab>
          }

          @if (((consumptionMeteringPoints$ | async) || []).length > 0) {
            <watt-tab [label]="'dashboard.tabs.consumer' | transloco" (changed)="activeTab = 'consumption'">
              @if (activeTab === 'consumption') {
                <eo-dashboard-consumption [period]="period()" />
              }
            </watt-tab>
          }

          <eo-dashboard-choose-period (periodChanged)="onPeriodChanged($event)" />
        </watt-tabs>
      }

      @if (
        (productionAndConsumptionMeteringPoints$ | async)?.length === 0 &&
        !(meteringPointError$ | async)
      ) {
        <watt-empty-state
          data-testid="no-data"
          icon="custom-power"
          [title]="'dashboard.no-data.title' | transloco"
          [message]="'dashboard.no-data.message' | transloco"
        />
      }

      @if ((meteringPointError$ | async) !== null) {
        <watt-empty-state
          data-testid="error"
          icon="custom-power"
          [title]="'dashboard.error.title' | transloco"
          [message]="'dashboard.error.message' | transloco"
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
  private destroyRef = inject(DestroyRef);

  period = signal<eoDashboardPeriod>(null);
  isLoadingMeteringPoints$ = this.meteringPointStore.loading$;
  productionMeteringPoints$ = this.meteringPointStore.productionMeteringPoints$;
  consumptionMeteringPoints$ = this.meteringPointStore.consumptionMeteringPoints$;
  productionAndConsumptionMeteringPoints$ =
    this.meteringPointStore.productionAndConsumptionMeteringPoints$;
  meteringPointError$ = this.meteringPointStore.meteringPointError$;

  @ViewChildren(WattTabComponent) tabs!: QueryList<WattTabComponent>;

  protected activeTab = 'production';

  ngOnInit(): void {
    this.meteringPointStore.loadMeteringPoints();
    this.aggregateService.clearCache();

    this.productionAndConsumptionMeteringPoints$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((meteringPoints) => {
        const hasProductionMeteringPoint = meteringPoints.find((mp) => mp.type === 'Production');
        this.activeTab = hasProductionMeteringPoint ? 'production' : 'consumption';
      });
  }

  protected onPeriodChanged(period: eoDashboardPeriod): void {
    this.period.set(period);
  }
}
