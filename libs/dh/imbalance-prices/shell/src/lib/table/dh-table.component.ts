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
import { Component, Input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { CurrencyPipe } from '@angular/common';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhImbalancePrice } from '../dh-imbalance-prices.mock';

@Component({
  selector: 'dh-imbalance-prices-table',
  standalone: true,
  templateUrl: './dh-table.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    CurrencyPipe,

    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,
    WattDatePipe,
    VaterFlexComponent,
    VaterStackComponent,
  ],
})
export class DhImbalancePricesTableComponent {
  columns: WattTableColumnDef<DhImbalancePrice> = {
    timestamp: { accessor: 'timestamp' },
    priceAreaDk1: { accessor: 'priceAreaDk1' },
    priceAreaDk2: { accessor: 'priceAreaDk2' },
  };

  @Input() isLoading!: boolean;
  @Input() hasError!: boolean;

  @Input({ required: true }) tableDataSource!: WattTableDataSource<DhImbalancePrice>;
}
