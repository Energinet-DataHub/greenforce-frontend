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
import { GfAnimationUiLottieComponent } from '@energinet-datahub/gf/animation/ui-lottie';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Observable, filter, take, tap } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EovOverviewStore } from '@energinet-datahub/eov/overview/data-access-api';
import { graphLoader } from '@energinet-datahub/eov/shared/assets';
import { BaseResponse, Datum, GraphData, MeteringPointDto } from '@energinet-datahub/eov/shared/domain';
import { eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattExpandableCardComponent, WattExpandableCardTitleComponent } from '@energinet-datahub/watt/expandable-card';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { TranslocoModule } from '@ngneat/transloco';
import { MasterdataAliasEditDialogComponent } from './masterdata-edit-alias-dialog/masterdata-edit-alias-dialog.component';
import { EovOverviewService } from '@energinet-datahub/eov/overview/data-access-api';
import { MasterdataDialogComponent } from './masterdata-dialog/masterdata-dialog.component';

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
  overviewService = inject(EovOverviewService);
  token?: string;
  isLoading: boolean[] = [];
  isExpanded: boolean[] = [];
  protected lottieAnimation = graphLoader;
  meteringPoints$?: Observable<MeteringPointDto[]>;
  username$?: Observable<string>;
  private labels = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
  protected barChartData: Array<ChartConfiguration<'bar'>['data']> = [];
  protected barChartOptions: Array<ChartConfiguration<'bar'>['options']> = [];

  ngOnInit() {
    this.store.loadMeteringPoints();
    this.username$ = this.store.username$;
    this.meteringPoints$ = this.store.meteringPoints$.pipe(
      filter((meteringPoints) => meteringPoints !== null && meteringPoints !== undefined),
      tap((meteringPoints) => {
        meteringPoints.forEach((m, index) => {
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
        });
        if (meteringPoints.length > 0) {
          this.isExpanded[0] = true;
          this.cardOpened(0);
          this.afterOpened(meteringPoints[0].meteringPointId, 0);
        }
        this.cd.detectChanges();
      })
    );
  }

  editAlias(meteringPointId: string, currentAlias?: string) {
    this.modalService.open({
      component: MasterdataAliasEditDialogComponent,
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

  showDetails(meteringPointId: string) {
    this.overviewService.getMeteringPoint(meteringPointId).pipe(take(1)).subscribe((meteringPointDetails) => {
      this.modalService.open({
        component: MasterdataDialogComponent,
        injector: this.injector,
        data: { details: meteringPointDetails },
        disableClose: true,
      });
    })
  }

  cardOpened(index: number) {
    this.isLoading[index] = true;
  }

  afterOpened(id: string, index: number) {
    this.fetchDataForGraph(id, index);
  }

  fetchDataForGraph(id: string, index: number) {
    this.overviewService.getGraphData(id).subscribe((graphData) => {
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
