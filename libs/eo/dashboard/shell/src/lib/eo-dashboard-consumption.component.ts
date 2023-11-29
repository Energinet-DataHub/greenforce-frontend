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

import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { EMPTY, catchError, forkJoin } from 'rxjs';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  eachDayOfInterval,
  endOfToday,
  fromUnixTime,
  getUnixTime,
  startOfToday,
  subDays,
} from 'date-fns';

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
import { EoCertificatesService } from '@energinet-datahub/eo/certificates/data-access-api';
import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';
import { EoAggregateService } from '@energinet-datahub/eo/wallet/data-access-api';

@Component({
  standalone: true,
  imports: [
    WATT_CARD,
    NgChartsModule,
    LottieComponent,
    NgIf,
    NgFor,
    RouterLink,
    EnergyUnitPipe,
    WattEmptyStateComponent,
    WattButtonComponent,
    PercentageOfPipe,
    VaterSpacerComponent,
    VaterStackComponent,
    WattIconComponent,
  ],
  providers: [EnergyUnitPipe],
  selector: 'eo-dashboard-consumption',
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
      <h4>Consumption (Activated Metering Points)</h4>
    </watt-card-title>

    <div class="loader-container" *ngIf="isLoading || hasError">
      <ng-lottie height="64px" width="64px" [options]="options" *ngIf="isLoading" />
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
      <div *ngIf="consumptionTotal > 0 || isLoading; else noData">
        <h5>{{ claimedTotal | percentageOf: consumptionTotal }} green energy</h5>
        <small
          >{{ claimedTotal | energyUnit }} of {{ consumptionTotal | energyUnit }} is certified green
          energy</small
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
          <span class="legend-label">{{ item.label }}</span>
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
export class EoDashboardConsumptionComponent implements OnInit {
  private cd = inject(ChangeDetectorRef);
  private certificatesService: EoCertificatesService = inject(EoCertificatesService);
  private aggregateService: EoAggregateService = inject(EoAggregateService);

  private startDate = getUnixTime(subDays(startOfToday(), 30)); // 30 days ago at 00:00
  private endDate = getUnixTime(endOfToday()); // Today at 23:59
  private labels = this.generateLabels();

  protected claimedTotal = 0;
  protected consumptionTotal = 0;
  protected routes = eoRoutes;

  protected options: AnimationOptions = {
    path: '/assets/graph-loader.json',
  };
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

  ngOnInit(): void {
    this.getData();
  }

  protected getData() {
    this.isLoading = true;
    this.hasError = false;

    const claims$ = this.aggregateService.getAggregatedClaims(
      EoTimeAggregate.Day,
      this.startDate,
      this.endDate
    );
    const certificates$ = this.certificatesService.getAggregatedCertificates(
      EoTimeAggregate.Day,
      this.startDate,
      this.endDate
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

        this.claimedTotal = claims.reduce((a: number, b: number) => a + b, 0);
        this.consumptionTotal =
          certificates.reduce((a: number, b: number) => a + b, 0) + this.claimedTotal;

        const unit = findNearestUnit(
          this.consumptionTotal /
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
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const text = context.dataset.label;
                  return `${Number(context.parsed.y).toFixed(2)} ${unit} ${text?.toLowerCase()}`;
                },
              },
            },
          },
        };

        this.barChartData = {
          ...this.barChartData,
          datasets: [
            {
              data: claims.map((x: number) => {
                return x > 0 ? fromWh(x, unit) : null;
              }),
              label: 'Green',
              borderRadius: Number.MAX_VALUE,
              maxBarThickness: 8,
              minBarLength: 8,
              backgroundColor: '#00C898',
            },
            {
              data: certificates.map((x: number) => {
                return x > 0 ? fromWh(x, unit) : null;
              }),
              label: 'Other',
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
    return eachDayOfInterval({
      start: fromUnixTime(this.startDate),
      end: fromUnixTime(this.endDate),
    }).map((date) => {
      // We're not using the WattDatePipe here because we want to use a custom format
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(date, 'd MMM');
    });
  }
}
