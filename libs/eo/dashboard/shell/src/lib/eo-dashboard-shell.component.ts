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
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { eoDashboardPeriod } from '@energinet-datahub/eo/dashboard/domain';
import { EoAggregateService } from '@energinet-datahub/eo/wallet/data-access-api';
import { EoDashboardChoosePeriodComponent } from './eo-dashboard-choose-period.component';
import { EoDashboardConsumptionComponent } from './eo-dashboard-consumption.component';
import { EoDashboardProductionTransferredComponent } from './eo-dashboard-production-transferred.component';
import { EoMeteringPointsStore } from '@energinet-datahub/eo/metering-points/data-access-api';
import {
  WattTabComponent,
  WattTabsActionComponent,
  WattTabsComponent,
} from '@energinet-datahub/watt/tabs';
import { TranslocoPipe } from '@jsverse/transloco';
import { translations } from '@energinet-datahub/eo/translations';
import { EoMeteringPoint } from '@energinet-datahub/eo/metering-points/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    AsyncPipe,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WattTabsComponent,
    WattTabComponent,
    WattTabsActionComponent,
    TranslocoPipe,
  ],
  selector: 'eo-dashboard-shell',
  template: `
    @if ((isLoadingMeteringPoints$ | async) === false) {
      @if (((productionAndConsumptionMeteringPoints$ | async) || []).length > 0) {
        <watt-tabs variant="secondary">
          @if (((productionMeteringPoints$ | async) || []).length > 0) {
            <watt-tab
              [label]="translations.dashboard.tabs.producer | transloco"
              (changed)="activeTab = 'production'"
            >
              @if (activeTab === 'production') {
                <eo-dashboard-production-transferred [period]="period()" />
              }
            </watt-tab>
          }

          @if (((consumptionMeteringPoints$ | async) || []).length > 0) {
            <watt-tab
              [label]="translations.dashboard.tabs.consumer | transloco"
              (changed)="activeTab = 'consumption'"
            >
              @if (activeTab === 'consumption') {
                <eo-dashboard-consumption [period]="period()" />
              }
            </watt-tab>
          }

          <watt-tabs-action>
            <eo-dashboard-choose-period (periodChanged)="onPeriodChanged($event)" />
          </watt-tabs-action>
        </watt-tabs>
      }

      @if (
        (productionAndConsumptionMeteringPoints$ | async)?.length === 0 &&
        (meteringPointError$ | async) === null
      ) {
        <watt-empty-state
          data-testid="no-data"
          icon="custom-power"
          [title]="'dashboard.noData.title' | transloco"
          [message]="'dashboard.noData.message' | transloco"
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
  private readonly meteringPointStore = inject(EoMeteringPointsStore);
  private readonly aggregateService: EoAggregateService = inject(EoAggregateService);
  private readonly destroyRef = inject(DestroyRef);

  period = signal<eoDashboardPeriod>(null);
  isLoadingMeteringPoints$ = this.meteringPointStore.loading$;
  productionMeteringPoints$ = this.meteringPointStore.productionMeteringPoints$;
  consumptionMeteringPoints$ = this.meteringPointStore.consumptionMeteringPoints$;
  productionAndConsumptionMeteringPoints$ =
    this.meteringPointStore.productionAndConsumptionMeteringPoints$;
  meteringPointError$ = this.meteringPointStore.meteringPointError$;

  @ViewChildren(WattTabComponent) tabs!: QueryList<WattTabComponent>;

  protected translations = translations;
  protected activeTab = 'production';

  ngOnInit(): void {
    this.meteringPointStore.loadMeteringPoints();
    this.aggregateService.clearCache();

    this.productionAndConsumptionMeteringPoints$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((meteringPoints: EoMeteringPoint[]) => {
        const hasProductionMeteringPoint = meteringPoints.find(
          (mp) => mp.meteringPointType === 'Production'
        );
        this.activeTab = hasProductionMeteringPoint ? 'production' : 'consumption';
      });
  }

  protected onPeriodChanged(period: eoDashboardPeriod): void {
    this.period.set(period);
  }
}
