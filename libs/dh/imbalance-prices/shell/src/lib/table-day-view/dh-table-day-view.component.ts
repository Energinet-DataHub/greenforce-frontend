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
import { DecimalPipe, NgClass } from '@angular/common';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe, dayjs } from '@energinet-datahub/watt/utils/date';

import { DhImbalancePricesForDay, DhImbalancePricesForDayProcessed } from '../dh-imbalance-prices';

@Component({
  selector: 'dh-table-day-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      .negative-price {
        color: var(--watt-color-state-danger);
      }
    `,
  ],
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
        {{ entry.timestampFrom | wattDate: 'time' }} -
        {{ entry.timestampTo | wattDate: 'time' }}
      </ng-container>

      <ng-container *wattTableCell="columns['price']; let entry">
        <span [ngClass]="{ 'negative-price': entry.price < 0 }">
          {{ entry.price | number: '1.5-6' }}
        </span>
      </ng-container>
    </watt-table>
  `,
  imports: [DecimalPipe, NgClass, WATT_TABLE, WattDatePipe],
})
export class DhTableDayViewComponent {
  columns: WattTableColumnDef<DhImbalancePricesForDayProcessed> = {
    period: { accessor: null },
    price: { accessor: null },
  };

  tableDataSource = new WattTableDataSource<DhImbalancePricesForDayProcessed>([]);

  data = input.required<DhImbalancePricesForDay[]>();

  constructor() {
    effect(() => {
      this.tableDataSource.data = this.processImbalancePricesForDay(this.data());
    });
  }

  private processImbalancePricesForDay(
    data: DhImbalancePricesForDay[]
  ): DhImbalancePricesForDayProcessed[] {
    if (data.length === 0) {
      return [];
    }

    const resolutionInMinutes = this.getResolutionInMinutes(data);

    return data.map((day) => ({
      ...day,
      timestampFrom: day.timestamp,
      timestampTo: dayjs(day.timestamp).add(resolutionInMinutes, 'minutes').toDate(),
    }));
  }

  private getResolutionInMinutes(data: DhImbalancePricesForDay[]) {
    const _60_min = 60;
    const _15_min = 15;

    if (data.length === 1) {
      return _60_min;
    }

    const [firstEntry, secondEntry] = data;

    return dayjs(secondEntry.timestamp).diff(dayjs(firstEntry.timestamp), 'minute') === _15_min
      ? _15_min
      : _60_min;
  }
}
