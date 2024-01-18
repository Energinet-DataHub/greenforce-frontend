import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  inject
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Observable, filter, tap } from 'rxjs';
import { GfAnimationUiLottieComponent } from '@energinet-datahub/gf/animation/ui-lottie';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EovOverviewStore } from '@energinet-datahub/eov/overview/data-access-api';
import { BaseResponse, Datum, GraphData, MeteringPointDto } from '@energinet-datahub/eov/shared/domain';
import { eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattExpandableCardComponent, WattExpandableCardTitleComponent } from '@energinet-datahub/watt/expandable-card';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { graphLoader } from '@energinet-datahub/eov/shared/assets';
import { TranslocoModule } from '@ngneat/transloco';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { EovOverviewUiMasterdataAliasEditDialogComponent } from 'libs/eov/overview/feature-masterdata-dialog/src';


@Component({
    selector: 'eov-overview-shell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './eov-overview-shell.component.scss',
    standalone: true,
    templateUrl: './eov-overview-shell.component.html',
    imports: [
      WATT_CARD,
      NgChartsModule,
      NgIf,
      NgFor,
      AsyncPipe,
      DecimalPipe,
      RouterLink,
      WattEmptyStateComponent,
      WattIconComponent,
      WattBadgeComponent,
      WattExpandableCardComponent,
      WattExpandableCardTitleComponent,
      WattButtonComponent,
      GfAnimationUiLottieComponent,
      TranslocoModule,
    ]
})
export class EovOverviewShellComponent implements OnInit {
  environment = inject(eovApiEnvironmentToken);
  injector = inject(Injector);
  route = inject(ActivatedRoute);
  cd = inject(ChangeDetectorRef);
  store = inject(EovOverviewStore);
  http = inject(HttpClient);
  modalService = inject(WattModalService);
  token?: string;
  isLoading: boolean[] = [];
  protected lottieAnimation = graphLoader;
  meteringPoints$?: Observable<MeteringPointDto[]>;
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

  editAlias(meteringPointId: string, currentAlias?: string) {
    this.modalService.open({
      component: EovOverviewUiMasterdataAliasEditDialogComponent,
      injector: this.injector,
      data: { meteringPointId, currentAlias },
      disableClose: true,
      onClosed: (result) => {
        if (result) {
          this.store.loadMeteringPoints();
        }
      },
    });
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
