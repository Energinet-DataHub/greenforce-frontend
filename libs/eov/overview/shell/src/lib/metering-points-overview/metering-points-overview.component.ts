import { ChangeDetectorRef, Component, inject, Injector, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  EovOverviewService,
  EovOverviewStore,
} from '@energinet-datahub/eov/overview/data-access-api';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { graphLoader } from '@energinet-datahub/eov/shared/assets';
import { filter, forkJoin, Observable, take, tap } from 'rxjs';
import { Datum, MeteringPointDto } from '@energinet-datahub/eov/shared/domain';
import { ChartConfiguration } from 'chart.js';
import {
  MasterdataAliasEditDialogComponent,
} from '../masterdata-edit-alias-dialog/masterdata-edit-alias-dialog.component';
import { MasterdataDialogComponent } from '../masterdata-dialog/masterdata-dialog.component';
import { DeclarationDialogComponent } from '../declaration-dialog/declaration-dialog.component';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { NgChartsModule } from 'ng2-charts';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import {
  WattExpandableCardComponent,
  WattExpandableCardTitleComponent,
} from '@energinet-datahub/watt/expandable-card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { GfAnimationUiLottieComponent } from '@energinet-datahub/gf/animation/ui-lottie';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'eov-metering-points-overview',
  standalone: true,
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
  ],
  templateUrl: './metering-points-overview.component.html',
  styleUrl: './metering-points-overview.component.scss'
})
export class MeteringPointsOverviewComponent implements OnInit {
  environment = inject(eovApiEnvironmentToken);
  injector = inject(Injector);
  route = inject(ActivatedRoute);
  cd = inject(ChangeDetectorRef);
  store = inject(EovOverviewStore);
  modalService = inject(WattModalService);
  overviewService = inject(EovOverviewService);
  token?: string;
  isLoading: boolean[] = [];
  isExpanded: boolean[] = [];
  protected lottieAnimation = graphLoader;
  meteringPoints$ = this.getMeteringPoints();
  private labels = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
  protected barChartData: Array<ChartConfiguration<'bar'>['data']> = [];
  protected barChartOptions: Array<ChartConfiguration<'bar'>['options']> = [];

  ngOnInit() {
    this.store.loadMeteringPoints();
  }

  getMeteringPoints() {
    return this.store.meteringPoints$.pipe(
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
          this.afterOpened(meteringPoints[0].meteringPointId!, 0);
        }
        this.cd.detectChanges();
      })
    );
  }

  editAlias(meteringPointId: string, currentAlias?: string | null) {
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
    forkJoin([this.overviewService.getMeteringPoint(meteringPointId), this.overviewService.getSupplierSwitchHistory(meteringPointId)]).pipe(take(1)).subscribe(([details, supplierHistory]) => {
      this.modalService.open({
        component: MasterdataDialogComponent,
        injector: this.injector,
        data: { details, supplierHistory: supplierHistory.supplierHistory },
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
      if (!graphData) {
        return;
      }
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
            data: graphData?.result?.series?.[0]?.data?.map((x: Datum) => {
              return x.y ?? 0;
            }) ?? [],
            borderRadius: Number.MAX_VALUE,
            label: 'Forbrug',
            maxBarThickness: 14,
            minBarLength: 2,
            backgroundColor: '#00C898',
          },
          {
            data: graphData?.result?.series?.[0]?.data?.map((x: Datum) => {
              return x.y === 0 ? Math.floor(Math.random() * 100) : Math.random() * 2 * (x.y ?? 0);
            }) ?? [],
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

  showDeclaration(meteringPointId: string) {
    this.modalService.open({
      component: DeclarationDialogComponent,
      injector: this.injector,
      data: { year: '2023' },
      disableClose: true,
    })
  }
}
