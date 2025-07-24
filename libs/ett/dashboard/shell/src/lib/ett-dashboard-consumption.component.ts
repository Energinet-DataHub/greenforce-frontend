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
  PercentagettfPipe,
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
  green: number;
  other: number;
  consumption: number;
  [key: string]: number;
}

@Component({
  imports: [
    WATT_CARD,
    NgChartsModule,
    RouterLink,
    EnergyUnitPipe,
    WattEmptyStateComponent,
    WattButtonComponent,
    PercentagettfPipe,
    VaterSpacerComponent,
    VaterStackComponent,
    WattIconComponent,
    EttLottieComponent,
    WattTooltipDirective,
    TranslocoPipe,
  ],
  providers: [EnergyUnitPipe],
  selector: 'ett-dashboard-consumption',
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

        watt-card-title {
          display: flex;
          gap: var(--watt-space-xs);
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
      <h4>{{ translations.consumerChart.title | transloco }}</h4>
      <watt-icon
        name="info"
        state="default"
        size="s"
        [wattTooltip]="translations.consumerChart.titleTooltip | transloco"
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
            [title]="translations.consumerChart.error.title | transloco"
            [message]="translations.consumerChart.error.message | transloco"
          >
            <watt-button variant="primary" (click)="getData()">{{
              translations.consumerChart.error.retry | transloco
            }}</watt-button>
          </watt-empty-state>
        }
      </div>
    }

    <vater-stack direction="row" gap="s">
      <div>
        @if (totals.consumption > 0 || isLoading) {
          <h5 data-testid="headline">
            {{
              translations.consumerChart.headline.default
                | transloco
                  : {
                      greenEnergyInPercentage: totals.green | percentagettf: totals.consumption,
                    }
            }}
          </h5>
          <small>{{
            translations.consumerChart.subHeadline
              | transloco
                : {
                    greenConsumption: totals.green | energyUnit,
                    totalComsumption: totals.consumption | energyUnit,
                  }
          }}</small>
        } @else {
          <h5 data-testid="no-data">
            {{ translations.consumerChart.headline.noData | transloco }}
          </h5>
          <small
            ><a [routerLink]="'../' + routes.meteringpoints"
              >{{ translations.consumerChart.activateMeteringPointsAction | transloco
              }}<watt-icon name="openInNew" size="xs" /></a
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
                  | transloco
                    : { percentage: totals[item.label] | percentagettf: totals.consumption }
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
export class EttDashboardConsumptionComponent implements OnChanges {
  @Input() period!: ettDashboardPeriod;

  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);
  private aggregateService: EttAggregateService = inject(EttAggregateService);

  private labels = this.generateLabels();

  protected translations = translations;
  protected totals: Totals = {
    green: 0,
    other: 0,
    consumption: 0,
  };

  protected routes = ettRoutes;

  protected legends: { [key: string]: string } = translations.consumerChart.legends;
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

    const claims$ = this.aggregateService.getAggregatedClaims(timeAggregate, start, end);
    const certificates$ = this.aggregateService.getAggregatedCertificates(
      timeAggregate,
      start,
      end
    );

    forkJoin({
      claims: claims$,
      certificates: certificates$,
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
        const { claims, certificates } = data;

        const claimedTotal = claims.reduce((a: number, b: number) => a + b, 0);
        const consumptionTotal =
          certificates.reduce((a: number, b: number) => a + b, 0) + claimedTotal;

        this.totals = {
          green: claimedTotal,
          other: consumptionTotal - claimedTotal,
          consumption: consumptionTotal,
        };

        const unit = findNearestUnit(
          consumptionTotal /
            Math.max(
              claims.filter((x: number) => x > 0).length,
              certificates.filter((x: number) => x > 0).length
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
              suggestedMax:
                findNearestUnit(this.findLargestNumberInDatasets([claims, certificates]))[0] * 1.1,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const type = context.dataset.label?.toLocaleLowerCase();
                  return this.transloco.translate('consumerChart.tooltips.' + type, {
                    amount: Number(context.parsed.y).toFixed(2),
                    unit,
                  });
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
              label: 'green',
              borderRadius: Number.MAX_VALUE,
              maxBarThickness: 8,
              minBarLength: 8,
              backgroundColor: '#00C898',
            },
            {
              data: certificates.map((x: number) => {
                return x > 0 ? fromWh(x, unit) : null;
              }),
              label: 'other',
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

  private findLargestNumberInDatasets(dataSets: number[][]) {
    const mergedArray = this.sumArrays(dataSets);
    return Math.max(...mergedArray);
  }

  private sumArrays(arrays: number[][]): number[] {
    return arrays[0].map((_, i) => arrays.reduce((sum, arr) => sum + arr[i], 0));
  }

  private generateLabels() {
    if (!this.period) return [];
    const { timeAggregate, start, end } = this.period;
    return this.aggregateService.getLabels(timeAggregate, start, end);
  }
}
