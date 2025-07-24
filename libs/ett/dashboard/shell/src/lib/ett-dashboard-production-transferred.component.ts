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
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';

import {
  EnergyUnitPipe,
  PercentageOfPipe,
  energyUnit,
  ettRoutes,
  findNearestUnit,
  fromWh,
} from '@energinet-datahub/ett/shared/utilities';
import { EttAggregateService } from '@energinet-datahub/ett/wallet/data-access-api';
import { ettDashboardPeriod } from '@energinet-datahub/ett/dashboard/domain';
import { graphLoader } from '@energinet-datahub/ett/shared/assets';
import { translations } from '@energinet-datahub/ett/translations';

import { EttLottieComponent } from './ett-lottie.component';

interface Totals {
  transferred: number;
  consumed: number;
  unused: number;
  production: number;
  [key: string]: number;
}

@Component({
  imports: [
    WATT_CARD,
    NgChartsModule,
    EnergyUnitPipe,
    WattEmptyStateComponent,
    WattButtonComponent,
    PercentageOfPipe,
    VaterSpacerComponent,
    VaterStackComponent,
    RouterLink,
    WattIconComponent,
    EttLottieComponent,
    WattTooltipDirective,
    TranslocoPipe,
  ],
  providers: [EnergyUnitPipe],
  selector: 'ett-dashboard-production-transferred',
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

        watt-card-title {
          display: flex;
          gap: var(--watt-space-xs);
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
      <h4>{{ translations.producerChart.title | transloco }}</h4>
      <watt-icon
        name="info"
        state="default"
        size="s"
        [wattTooltip]="translations.producerChart.titleTooltip | transloco"
        wattTooltipPosition="right"
      />
    </watt-card-title>

    @if (isLoading || hasError) {
      <div class="loader-container">
        @if (isLoading) {
          <ett-lottie height="64px" width="64px" [animationData]="lottieAnimation" />
        }
        @if (hasError) {
          <watt-empty-state
            data-testid="error"
            icon="custom-power"
            [title]="translations.producerChart.error.title | transloco"
            [message]="translations.producerChart.error.message | transloco"
          >
            <watt-button variant="primary" (click)="getData()">{{
              translations.producerChart.error.retry | transloco
            }}</watt-button>
          </watt-empty-state>
        }
      </div>
    }

    <vater-stack direction="row" gap="s">
      <div>
        @if (totals.production > 0 || isLoading) {
          <h5 data-testid="headline">
            {{
              translations.producerChart.headline.default
                | transloco
                  : {
                      transferredInPercentage:
                        totals.transferred | percentagettf: totals.production,
                    }
            }}
          </h5>
          <small>{{
            translations.producerChart.subHeadline
              | transloco
                : {
                    totalTransferred: totals.transferred | energyUnit,
                    totalProduced: totals.production | energyUnit,
                  }
          }}</small>
        } @else {
          <h5 data-testid="no-data">
            {{ translations.producerChart.headline.noData | transloco }}
          </h5>
          <small
            ><a [routerLink]="'../' + routes.meteringpoints"
              >{{ translations.producerChart.activateMeteringPointsAction | transloco }}
              <watt-icon name="openInNew" size="xs" /></a
          ></small>
        }
      </div>

      <vater-spacer />

      <ul class="legends">
        @for (item of barChartData.datasets.slice().reverse(); track item.label) {
          <li class="legend-item">
            <span class="legend-color" [style.background-color]="item.backgroundColor"></span>
            @if (item.label) {
              <span class="legend-label" [attr.data-testid]="item.label + '-legend'">{{
                legends[item.label]
                  | transloco: { percentage: totals[item.label] | percentagettf: totals.production }
              }}</span>
            }
          </li>
        }
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
export class EttDashboardProductionTransferredComponent implements OnChanges {
  @Input() period!: ettDashboardPeriod;

  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);
  private aggregateService = inject(EttAggregateService);

  private labels = this.generateLabels();

  protected translations = translations;
  protected currentTimestamp: string = new Date().toISOString();
  protected currentTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  protected totals: Totals = {
    transferred: 0,
    consumed: 0,
    unused: 0,
    production: 0,
  };

  protected routes = ettRoutes;

  protected legends: { [key: string]: string } = translations.producerChart.legends;
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
        this.setTotals(transfers, claims, certificates);

        const unit = this.getUnit(data);
        this.setChartOptions(data, unit);
        this.setCharData(data, unit);

        this.isLoading = false;
        this.cd.detectChanges();
      });
  }

  private getUnit(data: {
    transfers: number[];
    claims: number[];
    certificates: number[];
  }): energyUnit {
    const { transfers, claims, certificates } = data;

    return findNearestUnit(
      this.totals.production /
        Math.max(
          claims.filter((x: number) => x > 0).length,
          certificates.filter((x: number) => x > 0).length,
          transfers.filter((x: number) => x > 0).length
        )
    )[1];
  }

  private findLargestNumberInDatasets(dataSets: number[][]) {
    const mergedArray = this.sumArrays(dataSets);
    return Math.max(...mergedArray);
  }

  private sumArrays(arrays: number[][]): number[] {
    return arrays[0].map((_, i) => arrays.reduce((sum, arr) => sum + arr[i], 0));
  }

  private setChartOptions(
    data: { transfers: number[]; claims: number[]; certificates: number[] },
    unit: energyUnit
  ) {
    const { transfers, claims, certificates } = data;

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
          suggestedMax:
            findNearestUnit(
              this.findLargestNumberInDatasets([transfers, claims, certificates])
            )[0] * 1.1,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const type = context.dataset.label?.toLowerCase();
              let amount: number;

              if (type === 'transferred') {
                amount = transfers[context.dataIndex];
              } else if (type === 'consumed') {
                amount = claims[context.dataIndex];
              } else {
                amount = certificates[context.dataIndex];
              }

              return this.transloco.translate('producerChart.tooltips.' + type, {
                amount: fromWh(amount, unit).toFixed(2),
                unit: findNearestUnit(amount)[1],
              });
            },
          },
        },
      },
    };
  }

  private setCharData(
    data: { transfers: number[]; claims: number[]; certificates: number[] },
    unit: energyUnit
  ) {
    const { transfers, claims, certificates } = data;

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
  }

  private setTotals(transfers: number[], claims: number[], certificates: number[]) {
    const consumedTotal = claims.reduce((a: number, b: number) => a + b, 0);
    const unusedTotal = certificates.reduce((a: number, b: number) => a + b, 0);
    const transferredTotal = transfers.reduce((a: number, b: number) => a + b, 0);
    const productionTotal = consumedTotal + unusedTotal + transferredTotal;

    this.totals = {
      production: productionTotal,
      transferred: transferredTotal,
      consumed: consumedTotal,
      unused: unusedTotal,
    };
  }

  private generateLabels() {
    if (!this.period) return [];
    const { timeAggregate, start, end } = this.period;
    return this.aggregateService.getLabels(timeAggregate, start, end);
  }
}
