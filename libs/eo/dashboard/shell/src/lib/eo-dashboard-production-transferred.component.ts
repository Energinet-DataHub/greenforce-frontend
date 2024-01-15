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
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { EMPTY, catchError, forkJoin } from 'rxjs';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

import {
  EnergyUnitPipe,
  PercentageOfPipe,
  eoRoutes,
  findNearestUnit,
  fromWh,
} from '@energinet-datahub/eo/shared/utilities';
import { eoDashboardPeriod } from '@energinet-datahub/eo/dashboard/domain';

import { EoAggregateService } from '@energinet-datahub/eo/wallet/data-access-api';
import { EoLottieComponent } from './eo-lottie.component';
import { graphLoader } from '@energinet-datahub/eo/shared/assets';

interface Totals {
  transferred: number;
  consumed: number;
  unused: number;
  production: number;
  [key: string]: number;
}

@Component({
  standalone: true,
  imports: [
    WATT_CARD,
    NgChartsModule,
    NgIf,
    NgFor,
    EnergyUnitPipe,
    WattEmptyStateComponent,
    WattButtonComponent,
    PercentageOfPipe,
    VaterSpacerComponent,
    VaterStackComponent,
    RouterLink,
    WattIconComponent,
    EoLottieComponent,
    TitleCasePipe,
  ],
  providers: [EnergyUnitPipe],
  selector: 'eo-dashboard-production-transferred',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
        max-width: 100%;

        h5 {
          // TODO: NEW FONT STYLES
          font-size: 30px;
          line-height: 28px;
          color: var(--watt-on-light-high-emphasis);
          font-weight: 300;
          margin-bottom: var(--watt-space-s);
        }

        small {
          color: var(--watt-on-light-low-emphasis);
        }

        a {
          display: flex;
          align-items: center;
        }

        .chart-container {
          position: relative;
          width: calc(100vw - 80px);
          height: 196px;
          padding-top: var(--watt-space-m);
          max-width: 100%;

          @include watt.media('>=Large') {
            width: calc(100vw - 372px);
          }
        }

        .loader-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }

        watt-card {
          position: relative;
        }

        .legend-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          margin-bottom: var(--watt-space-xs);

          &::before {
            display: none;
          }

          .legend-color {
            width: 8px;
            min-width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            margin-right: var(--watt-space-s);
          }
        }
      }
    `,
  ],
  template: `<watt-card>
    <watt-card-title>
      <h4>Production (Activated Metering Points)</h4>
    </watt-card-title>

    <div class="loader-container" *ngIf="isLoading || hasError">
      <eo-lottie height="64px" width="64px" *ngIf="isLoading" [animationData]="lottieAnimation" />
      <watt-empty-state
        *ngIf="hasError"
        icon="custom-power"
        title="An unexpected error occured"
        message="Try again or contact your system administrator if you keep getting this error."
      >
        <watt-button variant="primary" size="normal" (click)="getData()">Reload</watt-button>
      </watt-empty-state>
    </div>

    <vater-stack direction="row" gap="s">
      <div *ngIf="totals.production > 0 || isLoading; else noData">
        <h5>{{ totals.transferred | percentageOf: totals.production }} transferred</h5>
        <small
          >{{ totals.transferred | energyUnit }} of {{ totals.production | energyUnit }} certified green
          production was transferred</small
        >
      </div>

      <ng-template #noData>
        <div>
          <h5>No data</h5>
          <small
            ><a [routerLink]="'../' + routes.meteringpoints"
              >Activate metering points <watt-icon name="openInNew" size="xs" /></a
          ></small>
        </div>
      </ng-template>

      <vater-spacer />

      <ul class="legends">
        <li *ngFor="let item of barChartData.datasets" class="legend-item">
          <span class="legend-color" [style.background-color]="item.backgroundColor"></span>
          @if(item.label) {
            <span class="legend-label">{{ item.label | titlecase }} ({{ totals[item.label] | percentageOf: totals.production }})</span>
          }
        </li>
      </ul>
    </vater-stack>

    <div class="chart-container">
      <canvas
        baseChart
        [data]="barChartData"
        [options]="barChartOptions"
        [legend]="false"
        [type]="'bar'"
      >
      </canvas>
    </div>
  </watt-card>`,
})
export class EoDashboardProductionTransferredComponent implements OnChanges {
  @Input() period!: eoDashboardPeriod;

  private cd = inject(ChangeDetectorRef);
  private aggregateService = inject(EoAggregateService);

  private labels = this.generateLabels();

  protected totals: Totals = {
    transferred: 0,
    consumed: 0,
    unused: 0,
    production: 0,
  };

  protected routes = eoRoutes;

  protected lottieAnimation = graphLoader;
  protected isLoading = false;
  protected hasError = false;

  protected barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.labels,
    datasets: [],
  };
  protected barChartOptions: ChartConfiguration<'bar'>['options'] = {
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          maxRotation: 0,
          autoSkipPadding: 12,
        },
      },
      y: {
        stacked: true,
        title: { display: true, text: 'Wh', align: 'end' },
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.period) {
      this.getData();
    }
  }

  protected getData() {
    if (!this.period) return;

    this.isLoading = true;
    this.hasError = false;

    const { timeAggregate, start, end } = this.period;

    const transfers$ = this.aggregateService.getAggregatedTransfers(timeAggregate, start, end);
    const claims$ = this.aggregateService.getAggregatedClaims(timeAggregate, start, end);
    const productionCertificates$ = this.aggregateService.getAggregatedCertificates(
      timeAggregate,
      start,
      end,
      'production'
    );

    forkJoin({
      transfers: transfers$,
      claims: claims$,
      certificates: productionCertificates$,
    })
      .pipe(
        catchError(() => {
          this.isLoading = false;
          this.hasError = true;
          this.cd.detectChanges();
          return EMPTY;
        })
      )
      .subscribe((data) => {
        const { transfers, claims, certificates } = data;


        const consumedTotal = claims.reduce((a: number, b: number) => a + b, 0);
        const unusedTotal = certificates.reduce((a: number, b: number) => a + b, 0);
        const transferredTotal = transfers.reduce((a: number, b: number) => a + b, 0);

        const productionTotal =
        consumedTotal+
        unusedTotal +
        transferredTotal;

        this.totals = {
          production: productionTotal,
          transferred: transferredTotal,
          consumed: consumedTotal,
          unused: unusedTotal,
        }

        const unit = findNearestUnit(
          productionTotal /
            Math.max(
              claims.filter((x: number) => x > 0).length,
              certificates.filter((x: number) => x > 0).length,
              transfers.filter((x: number) => x > 0).length
            )
        )[1];

        this.barChartOptions = {
          ...this.barChartOptions,
          scales: {
            ...this.barChartOptions?.scales,
            y: {
              ...this.barChartOptions?.scales?.y,
              title: {
                ...this.barChartOptions?.scales?.y?.title,
                display: true,
                text: unit,
                align: 'end',
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const type = context.dataset.label?.toLowerCase();
                  let amount: number;

                  if(type === 'transferred') {
                    amount = transfers[context.dataIndex];
                  } else if(type === 'consumed') {
                    amount = claims[context.dataIndex];
                  } else {
                    amount = certificates[context.dataIndex];
                  }

                  const unit = findNearestUnit(amount)[1];
                  return `${fromWh(amount, unit).toFixed(2)} ${unit} ${type}`;
                },
              },
            },
          },
        };

        this.barChartData = {
          ...this.barChartData,
          labels: this.generateLabels(),
          datasets: [
            {
              data: claims.map((x: number) => {
                return x > 0 ? fromWh(x, unit) : null;
              }),
              label: 'consumed',
              borderRadius: Number.MAX_VALUE,
              maxBarThickness: 8,
              minBarLength: 8,
              backgroundColor: '#f8ad3c',
            },
            {
              data: transfers.map((x: number) => {
                return x > 0 ? fromWh(x, unit) : null;
              }),
              label: 'transferred',
              borderRadius: Number.MAX_VALUE,
              maxBarThickness: 8,
              minBarLength: 8,
              backgroundColor: '#00C898',
            },
            {
              data: certificates.map((x) => {
                return x > 0 ? fromWh(x, unit) : null;
              }),
              label: 'unused',
              borderRadius: Number.MAX_VALUE,
              maxBarThickness: 8,
              minBarLength: 8,
              backgroundColor: '#02525E',
            },
          ],
        };

        this.isLoading = false;
        this.cd.detectChanges();
      });
  }

  private generateLabels() {
    if (!this.period) return [];
    const { timeAggregate, start, end } = this.period;
    return this.aggregateService.getLabels(timeAggregate, start, end);
  }
}
