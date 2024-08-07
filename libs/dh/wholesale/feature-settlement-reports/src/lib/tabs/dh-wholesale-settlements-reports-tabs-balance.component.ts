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
  LOCALE_ID,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { ApolloError } from '@apollo/client/errors';
import { Subscription, switchMap } from 'rxjs';
import { Apollo } from 'apollo-angular';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import {
  WholesaleCalculationType,
  WholesaleSettlementReportHttp,
} from '@energinet-datahub/dh/shared/domain';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { Actor, ActorFilter, GridArea } from '@energinet-datahub/dh/wholesale/domain';
import { streamToFile } from '@energinet-datahub/dh/shared/ui-util';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattToastService } from '@energinet-datahub/watt/toast';
import {
  WATT_TABLE,
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import {
  EicFunction,
  GetActorsForSettlementReportDocument,
  GetGridAreasDocument,
  GridAreaDto,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dayjs } from '@energinet-datahub/watt/date';

export type settlementReportsTableColumns = GridAreaDto & { download: boolean };

@Component({
  standalone: true,
  selector: 'dh-wholesale-settlements-reports-tabs-balance',
  templateUrl: './dh-wholesale-settlements-reports-tabs-balance.component.html',
  styles: [
    `
      dh-wholesale-settlements-reports-tabs-balance .filters {
        vater-stack > * {
          min-height: 74px;
        }

        watt-field-error {
          position: absolute;
        }
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ReactiveFormsModule,

    WATT_TABS,
    WATT_TABLE,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattFormChipDirective,
    WattDropdownComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    VaterStackComponent,
    VaterSpacerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DhWholesaleSettlementsReportsTabsBalanceComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private fb: FormBuilder = inject(FormBuilder);
  private apollo = inject(Apollo);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private httpClient = inject(WholesaleSettlementReportHttp);
  private localeId = inject(LOCALE_ID);

  private subscriptionGridAreas?: Subscription;
  private subscriptionGridAreasForFilter?: Subscription;
  private subscriptionActors?: Subscription;
  private subscriptionGridAreaSelected?: Subscription;

  @ViewChild(WattTableComponent)
  resultTable!: WattTableComponent<settlementReportsTableColumns>;

  searchForm = this.fb.group({
    period: [{ start: '', end: '' }, WattRangeValidators.required],
    actor: [''],
    gridAreas: [[] as string[]],
  });

  columns: WattTableColumnDef<settlementReportsTableColumns> = {
    gridAreaName: { accessor: 'name' },
    gridAreaCode: { accessor: 'code' },
    download: { accessor: null },
  };

  actorsQuery = this.apollo.watchQuery({
    query: GetActorsForSettlementReportDocument,
    variables: {
      eicFunctions: [EicFunction.GridAccessProvider, EicFunction.EnergySupplier],
    },
  });

  gridAreasQuery = this.apollo.watchQuery({
    query: GetGridAreasDocument,
  });

  gridAreasForFilterQuery = this.apollo.watchQuery({
    query: GetGridAreasDocument,
  });

  actors!: ActorFilter;
  gridAreas: WattDropdownOption[] = [];
  selectedGridAreas?: string[];
  error?: ApolloError;
  loadingGridAreas = signal<boolean>(false);
  dataSource = new WattTableDataSource<settlementReportsTableColumns>();

  ngOnInit(): void {
    this.subscriptionActors = this.actorsQuery.valueChanges.subscribe({
      next: (result) => {
        const actorsClone = structuredClone(result.data?.actorsForEicFunction ?? []);
        this.actors = actorsClone.sort((a: Actor, b: Actor) =>
          a.displayValue.localeCompare(b.displayValue, this.localeId)
        );

        if (!result.loading) this.searchForm.controls.actor.enable();
      },
      error: (error) => {
        this.error = error;
      },
    });

    this.subscriptionGridAreas = this.gridAreasQuery.valueChanges.subscribe({
      next: (result) => {
        this.loadingGridAreas.set(result.loading);
        this.error = result.error;
        this.dataSource.data =
          result.data?.gridAreas
            ?.filter((x) => {
              if (!this.selectedGridAreas || this.selectedGridAreas?.length === 0) return true;
              return this.selectedGridAreas?.includes(x.code);
            })
            .map((g) => ({
              __typename: 'GridAreaDto',
              code: g.code,
              id: g.code,
              name: g.name,
              displayName: g.displayName,
              priceAreaCode: PriceAreaCode.Dk1,
              validFrom: g.validFrom,
              validtTo: g.validTo,
              download: true,
            })) ?? [];
      },
      error: (error) => {
        this.loadingGridAreas.set(false);
        this.error = error;
      },
    });

    this.subscriptionGridAreasForFilter = this.gridAreasForFilterQuery.valueChanges.subscribe({
      next: (result) => {
        const gridAreasClone = structuredClone(result.data?.gridAreas ?? []);
        gridAreasClone.sort((a: GridArea, b: GridArea) => Number(a.code) - Number(b.code));

        this.gridAreas = gridAreasClone.map((g: GridArea) => ({
          displayValue: g.displayName,
          value: g.code,
        }));

        if (!result.loading) this.searchForm.controls.gridAreas.enable();
      },
      error: () => {
        this.toastService.open({
          type: 'danger',
          message: this.transloco.translate('wholesale.settlementReports.gridAreasLoadFailed'),
        });
      },
    });
  }

  ngAfterViewInit(): void {
    this.subscriptionGridAreaSelected = this.searchForm.controls.gridAreas.valueChanges.subscribe(
      (value) => {
        this.selectedGridAreas = value ?? [];
        this.resultTable?.clearSelection();
        this.gridAreasQuery.refetch();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionGridAreas?.unsubscribe();
    this.subscriptionActors?.unsubscribe();
    this.subscriptionGridAreaSelected?.unsubscribe();
    this.subscriptionGridAreasForFilter?.unsubscribe();
  }

  downloadClicked(gridAreas: settlementReportsTableColumns[]) {
    const fileOptions = { name: 'SettlementReport.zip', type: 'application/zip' };

    this.toastService.open({
      type: 'loading',
      message: this.transloco.translate('shared.downloadStart'),
    });

    const { start, end } = this.searchForm.controls.period.value as { start: string; end: string };
    const startDate = dayjs(start).add(1, 'day').toDate();
    const endDate = dayjs(end).add(1, 'day').toDate();

    this.httpClient
      .v1WholesaleSettlementReportDownloadGet(
        gridAreas.map((g) => g.id),
        WholesaleCalculationType.BalanceFixing,
        startDate.toISOString().slice(0, 10),
        endDate.toISOString().slice(0, 10),
        this.searchForm.controls.actor.value ?? undefined,
        this.transloco.translate('selectedLanguageIso')
      )
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () =>
          this.toastService.open({
            type: 'danger',
            message: this.transloco.translate('shared.downloadFailed'),
          }),
      });
  }
}
