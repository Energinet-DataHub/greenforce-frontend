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
import { Component, Input, signal } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhImbalancePrice } from '../dh-imbalance-prices';
import { DhStatusBadgeComponent } from '../status-badge/dh-status-badge.component';
import { DhImbalancePricesDrawerComponent } from '../drawer/dh-drawer.component';

@Component({
  selector: 'dh-table-month-view',
  standalone: true,
  templateUrl: './dh-table-month-view.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    WATT_TABLE,
    WattEmptyStateComponent,
    WattDatePipe,
    VaterFlexComponent,
    VaterStackComponent,

    DhStatusBadgeComponent,
    DhImbalancePricesDrawerComponent,
  ],
})
export class DhTableMonthViewComponent {
  columns: WattTableColumnDef<DhImbalancePrice> = {
    period: { accessor: 'name' },
    priceArea: { accessor: 'priceAreaCode' },
    status: { accessor: 'status' },
  };

  activeRow = signal<DhImbalancePrice | undefined>(undefined);

  @Input() isLoading!: boolean;
  @Input() hasError!: boolean;

  @Input({ required: true }) tableDataSource!: WattTableDataSource<DhImbalancePrice>;

  onRowClick(entry: DhImbalancePrice): void {
    this.activeRow.set(entry);
  }

  onClose(): void {
    this.activeRow.set(undefined);
  }
}
