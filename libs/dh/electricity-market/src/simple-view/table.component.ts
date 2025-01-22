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
import { Component } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';

import { MeteringPointPeriodDto } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetMeteringPointDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

@Component({
  selector: 'dh-electricity-market-simple-view',
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_TABLE,
    WattDatePipe,
    WattDataTableComponent,

    VaterUtilityDirective,
  ],
  template: `
    <watt-data-table
      vater
      inset="ml"
      [enableQueryTime]="true"
      *transloco="let t; read: 'electricityMarket.table'"
      [searchLabel]="'shared.search' | transloco"
      [error]="dataSource.error"
      [ready]="dataSource.called"
    >
      <h3>{{ t('headline') }}</h3>

      <watt-table [dataSource]="dataSource" [columns]="columns" [loading]="dataSource.loading">
        <ng-container *wattTableCell="columns.id; header: t('id'); let element">
          {{ element.id }}
        </ng-container>

        <ng-container *wattTableCell="columns.ownenBy; header: t('ownenBy'); let element">
          {{ element.ownenBy }}
        </ng-container>
        <ng-container
          *wattTableCell="columns.connectionState; header: t('connectionState'); let element"
        >
          {{ element.connectionState }}
        </ng-container>
        <ng-container *wattTableCell="columns.createdAt; header: t('createdAt'); let element">
          {{ element.createdAt | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.gridAreaCode; header: t('gridAreaCode'); let element">
          {{ element.gridAreaCode }}
        </ng-container>
        <ng-container *wattTableCell="columns.productId; header: t('productId'); let element">
          {{ element.productId }}
        </ng-container>
        <ng-container *wattTableCell="columns.resolution; header: t('resolution'); let element">
          {{ element.resolution }}
        </ng-container>
        <ng-container
          *wattTableCell="
            columns.scheduledMeterReadingMonth;
            header: t('scheduledMeterReadingMonth');
            let element
          "
        >
          {{ element.scheduledMeterReadingMonth }}
        </ng-container>
        <ng-container *wattTableCell="columns.type; header: t('type'); let element">
          {{ element.type }}
        </ng-container>
        <ng-container *wattTableCell="columns.subType; header: t('subType'); let element">
          {{ element.subType }}
        </ng-container>
        <ng-container *wattTableCell="columns.validFrom; header: t('validFrom'); let element">
          {{ element.validFrom | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.validTo; header: t('validTo'); let element">
          {{ element.validTo | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.unit; header: t('unit'); let element">
          {{ element.unit }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhElectricityMarketSimpleViewComponent {
  columns: WattTableColumnDef<MeteringPointPeriodDto> = {
    name: { accessor: 'id' },
    ownenBy: { accessor: 'ownenBy' },
    connectionState: { accessor: 'connectionState' },
    createdAt: { accessor: 'createdAt' },
    gridAreaCode: { accessor: 'gridAreaCode' },
    productId: { accessor: 'productId' },
    scheduledMeterReadingMonth: { accessor: 'scheduledMeterReadingMonth' },
    type: { accessor: 'type' },
    subType: { accessor: 'subType' },
    validFrom: { accessor: 'validFrom' },
    validTo: { accessor: 'validTo' },
    unit: { accessor: 'unit' },
  };

  dataSource = new GetMeteringPointDataSource();
}
