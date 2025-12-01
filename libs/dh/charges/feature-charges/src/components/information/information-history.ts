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

import { VaterUtilityDirective } from '@energinet/watt/vater';
import { WATT_CARD } from '@energinet/watt/card';
import { WattDatePipe } from '@energinet/watt/date';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WattTableCellDirective,
} from '@energinet/watt/table';

import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-charges-information-history',
  imports: [
    TranslocoDirective,
    VaterUtilityDirective,
    WATT_CARD,
    WattDatePipe,
    WattTableComponent,
    WattTableCellDirective,
    DhResultComponent,
  ],
  template: `
    <div vater inset="ml">
      <watt-card variant="solid" *transloco="let t; prefix: 'charges.priceInformation.history'">
        <dh-result [hasError]="hasError()" [loading]="isLoading()">
          <watt-table
            *transloco="let resolveHeader; prefix: 'charges.priceInformation.history.table.columns'"
            [columns]="columns"
            [dataSource]="dataSource"
            [hideColumnHeaders]="true"
            [resolveHeader]="resolveHeader"
            [sortClear]="false"
            sortBy="timestamp"
            sortDirection="desc"
          >
            <ng-container *wattTableCell="columns.timestamp; let element">
              {{ element.timestamp | wattDate: 'long' }}
            </ng-container>
            <ng-container *wattTableCell="columns.entry; let element">
              <span [innerHTML]="t('auditLogs.' + element.entry, element)"> </span>
            </ng-container>
          </watt-table>
        </dh-result>
      </watt-card>
    </div>
  `,
})
export class DhChargesInformationHistory {
  hasError = signal(false);
  isLoading = signal(false);
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
    timestamp: { accessor: 'timestamp', size: 'auto' },
    entry: { accessor: 'entry', size: '1fr' },
  };
}
