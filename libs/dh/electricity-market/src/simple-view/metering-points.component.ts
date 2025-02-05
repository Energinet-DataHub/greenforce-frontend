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

import { GetMeteringPointDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { MeteringPointPeriod } from '../types';

@Component({
  selector: 'dh-metering-points',
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
      [error]="meteringPointPeriods.error"
      [ready]="meteringPointPeriods.called"
    >
      <h3>Metering point periods</h3>

      <watt-table
        [dataSource]="meteringPointPeriods"
        [columns]="columns"
        [loading]="meteringPointPeriods.loading"
      >
        <ng-container *wattTableCell="columns.id; let element">
          {{ element.meteringPointId }}
        </ng-container>

        <ng-container *wattTableCell="columns.ownedBy; let element">
          {{ element.ownedBy }}
        </ng-container>
        <ng-container *wattTableCell="columns.connectionState; let element">
          {{ element.connectionState }}
        </ng-container>
        <ng-container *wattTableCell="columns.createdAt; let element">
          {{ element.createdAt | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.gridAreaCode; let element">
          {{ element.gridAreaCode }}
        </ng-container>
        <ng-container *wattTableCell="columns.productId; let element">
          {{ element.productId }}
        </ng-container>
        <ng-container *wattTableCell="columns.resolution; let element">
          {{ element.resolution }}
        </ng-container>
        <ng-container *wattTableCell="columns.scheduledMeterReadingMonth; let element">
          {{ element.scheduledMeterReadingMonth }}
        </ng-container>
        <ng-container *wattTableCell="columns.type; let element">
          {{ element.type }}
        </ng-container>
        <ng-container *wattTableCell="columns.subType; let element">
          {{ element.subType }}
        </ng-container>
        <ng-container *wattTableCell="columns.validFrom; let element">
          {{ element.validFrom | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.validTo; let element">
          {{ element.validTo | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.unit; let element">
          {{ element.unit }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeteringPointsComponent {
  columns: WattTableColumnDef<MeteringPointPeriod> = {
    id: { accessor: 'meteringPointId' },
    ownedBy: { accessor: 'ownedBy' },
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

  meteringPointPeriods = new GetMeteringPointDataSource({ skip: true });
}
