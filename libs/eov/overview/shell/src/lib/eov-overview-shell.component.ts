import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { Observable, filter, tap } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EovOverviewStore } from '@energinet-datahub/eov/overview/data-access-api';
import { BaseResponse, Datum, GraphData, MeteringPointDto } from '@energinet-datahub/eov/shared/domain';
import { eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattExpandableCardComponent, WattExpandableCardTitleComponent } from '@energinet-datahub/watt/expandable-card';
import { WattIconComponent } from '@energinet-datahub/watt/icon';


@Component({
    selector: 'eov-overview-shell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
      @use '@energinet-datahub/watt/utils' as watt;

      div.container__content {
        padding: 10px 0 0 0;
      }

      watt-expandable-card {
        padding: var(--watt-space-s);
      }

      :host {

        h5 {
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
          width: calc(100% - 20px);
          height: 300px;
          padding-top: var(--watt-space-m);
          padding-bottom: var(--watt-space-m);
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
    `],
    standalone: true,
    template: `
    <div class="container__content">
      <h2>Målepunkter</h2>
      <watt-expandable-card *ngFor="let meteringPoint of meteringPoints$ | async; index as i" (cardOpened)="cardOpened(i)" (afterExpanded)="afterOpened(meteringPoint.meteringPointId, i)">
        <watt-badge size="large">{{ i | number:'2.0' }}</watt-badge>
        <watt-expandable-card-title>{{ meteringPoint.meteringPointAlias === null ? meteringPoint.address + ", " + meteringPoint.postcode + " " + meteringPoint.cityName + ": " + meteringPoint.meteringPointId : meteringPoint.meteringPointAlias }}</watt-expandable-card-title>

        <div class="loader-container" *ngIf="isLoading[i]">
          <ng-lottie height="64px" width="64px" [options]="options" *ngIf="isLoading[i]" />
        </div>

        <ul class="legends">
          <li *ngFor="let item of barChartData[i]?.datasets" class="legend-item">
            <span class="legend-color" [style.background-color]="item.backgroundColor"></span>
            <span class="legend-label">{{ item.label }}</span>
          </li>
        </ul>

        <div class="chart-container">
          <canvas
            baseChart
            [data]="barChartData[i]"
            [options]="barChartOptions[i]"
            [legend]="false"
            [type]="'bar'"
          >
          </canvas>
        </div>
      </watt-expandable-card>
    </div>
  `,
    imports: [
      WATT_CARD,
      NgChartsModule,
      LottieComponent,
      NgIf,
      NgFor,
      AsyncPipe,
      DecimalPipe,
      RouterLink,
      WattEmptyStateComponent,
      WattIconComponent,
      WattBadgeComponent,
      WattExpandableCardComponent,
      WattExpandableCardTitleComponent
    ]
})
export class EovOverviewShellComponent implements OnInit {
  environment = inject(eovApiEnvironmentToken);
  route = inject(ActivatedRoute);
  cd = inject(ChangeDetectorRef);
  store = inject(EovOverviewStore);
  http = inject(HttpClient);
  token?: string;
  isLoading: boolean[] = [];
  meteringPoints$?: Observable<MeteringPointDto[]>;
  protected options: AnimationOptions = {
    path: '/assets/animations/graph-loader.json',
  };
  private labels = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
  protected barChartData: Array<ChartConfiguration<'bar'>['data']> = [];
  protected barChartOptions: Array<ChartConfiguration<'bar'>['options']> = [];

  ngOnInit() {
    this.store.loadMeteringPoints();
    this.meteringPoints$ = this.store.meteringPoints$.pipe(
      filter((meteringPoints) => meteringPoints !== null && meteringPoints !== undefined),
      tap((meteringPoints) => meteringPoints.forEach((m, index) => {
        this.isLoading[index] = false;
        this.barChartData[index] = {
          labels: this.labels,
          datasets: [],
        };
        this.barChartOptions[index] = {
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: false,
              grid: { display: false },
              ticks: {
                maxRotation: 0,
                autoSkipPadding: 12,
              },
            },
            y: {
              stacked: false,
              title: { display: true, text: 'Wh', align: 'end' },
            },
          },
        };
        this.cd.detectChanges();
      }))
    );
  }

  cardOpened(index: number) {
    this.isLoading[index] = true;
  }

  afterOpened(id: string, index: number) {
    this.fetchDataForGraph(id, index);
  }

  fetchDataForGraph(id: string, index: number) {
    let params = new HttpHeaders();
    params = params.set('Authorization', 'Bearer ' + this.token);
    this.http.get<BaseResponse<GraphData>>(this.environment.customerApiUrl + '/api/MeterData/GetMonthlyGraphData/' + id, { headers: params }).subscribe((graphData) => {
      this.barChartOptions[index] = {
        ...this.barChartOptions[index],
        scales: {
          ...this.barChartOptions[index]?.scales,
          y: {
            ...this.barChartOptions[index]?.scales?.['y'],
            title: {
              ...this.barChartOptions[index]?.scales?.['y']?.title,
              display: true,
              text: 'kWh',
              align: 'end',
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${Number(context.parsed.y).toFixed(2)} kWh`;
              },
            },
          },
        },
      };

      this.barChartData[index] = {
        ...this.barChartData[index],
        labels: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
        datasets: [
          {
            data: graphData.result.series[0]?.data.map((x: Datum) => {
              return x.y;
            }),
            borderRadius: Number.MAX_VALUE,
            label: 'Forbrug',
            maxBarThickness: 14,
            minBarLength: 2,
            backgroundColor: '#00C898',
          },
          {
            data: graphData.result.series[0]?.data.map((x: Datum) => {
              return x.y === 0 ? Math.floor(Math.random() * 100) : Math.random() * 2 * x.y;
            }),
            borderRadius: Number.MAX_VALUE,
            label: 'Forbrug året inden',
            maxBarThickness: 14,
            minBarLength: 2,
            backgroundColor: '#02525E',
          },
        ],
      };

      this.isLoading[index] = false;
      this.cd.detectChanges();
    })
  };
}
