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
import { Component, input, effect, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { ImbalancePrice } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-table-day-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <watt-table
      [dataSource]="tableDataSource"
      [columns]="columns"
      [sortClear]="false"
      sortBy="period"
      sortDirection="desc"
      [suppressRowHoverHighlight]="true"
      [hideColumnHeaders]="true"
    >
      <ng-container *wattTableCell="columns['period']; let entry">
        {{ entry.timestamp | wattDate: 'time' }} -
        {{ entry.timestamp | wattDate: 'time' }}
      </ng-container>

      <ng-container *wattTableCell="columns['price']; let entry">
        {{ entry.price | number: '1.5-6' }}
      </ng-container>
    </watt-table>
  `,
  imports: [DecimalPipe, WATT_TABLE, WattDatePipe],
})
export class DhTableDayViewComponent {
  columns: WattTableColumnDef<ImbalancePrice> = {
    period: { accessor: null },
    price: { accessor: null },
  };

  tableDataSource = new WattTableDataSource<ImbalancePrice>([]);

  data = input.required<ImbalancePrice[]>();

  constructor() {
    effect(() => {
      this.tableDataSource.data = this.data();
    });
  }
}
