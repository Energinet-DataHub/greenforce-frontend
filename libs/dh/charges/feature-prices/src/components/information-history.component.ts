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
import { Component, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet/watt/date';
import { VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDataTableComponent } from '@energinet/watt/data';

import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WattTableCellDirective,
} from '@energinet/watt/table';

@Component({
  selector: 'dh-price-information-history',
  imports: [
    TranslocoDirective,
    VaterUtilityDirective,

    WattDatePipe,
    WattTableComponent,
    WattDataTableComponent,
    WattTableCellDirective,
  ],
  template: `
    <div vater inset="ml">
      <watt-data-table
        vater
        variant="solid"
        *transloco="let t; prefix: 'charges.charge.priceInformation.history'"
        [enableSearch]="false"
        [enablePaginator]="false"
        [enableCount]="false"
        [autoSize]="true"
        [header]="false"
        [error]="hasError()"
        [ready]="ready()"
      >
        <watt-table
          [columns]="columns"
          [dataSource]="dataSource"
          sortBy="timestamp"
          [loading]="isLoading()"
          sortDirection="desc"
          [hideColumnHeaders]="true"
          [sortClear]="false"
        >
          <ng-container
            *wattTableCell="columns.timestamp; header: t('table.columns.timestamp'); let element"
          >
            {{ element.timestamp | wattDate: 'long' }}
          </ng-container>

          <ng-container
            *wattTableCell="columns.entry; header: t('table.columns.entry'); let element"
          >
            <span [innerHTML]="t('auditLogs.' + element.entry, element)"> </span>
          </ng-container>
        </watt-table>
      </watt-data-table>
    </div>
  `,
})
export class DhPriceInformationHistoryComponent {
  hasError = signal(false);
  isLoading = signal(true);
  ready = signal(false);
  dataSource = new WattTableDataSource<{ timestamp: string; entry: string }>([
    {
      timestamp: '2024-01-01T12:00:00Z',
      entry: 'Sample entry',
    },
    {
      timestamp: '2024-01-01T12:00:00Z',
      entry: 'Sample entry',
    },
  ]);

  columns: WattTableColumnDef<{ timestamp: string; entry: string }> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: 'entry' },
  };
}
