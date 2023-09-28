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
import { Component, Input, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { DhBalanceResponsibleMessage } from '../dh-balance-responsible-message';
import { DhBalanceResponsibleDrawerComponent } from '../drawer/dh-drawer.component';

@Component({
  selector: 'dh-balance-responsible-table',
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
    NgIf,
    TranslocoDirective,
    TranslocoPipe,

    WATT_TABLE,
    WattDatePipe,
    WattEmptyStateComponent,
    VaterFlexComponent,
    VaterStackComponent,

    DhEmDashFallbackPipe,
    DhBalanceResponsibleDrawerComponent,
  ],
})
export class DhBalanceResponsibleTableComponent {
  activeRow: DhBalanceResponsibleMessage | undefined = undefined;

  @ViewChild(DhBalanceResponsibleDrawerComponent)
  drawer: DhBalanceResponsibleDrawerComponent | undefined;

  columns: WattTableColumnDef<DhBalanceResponsibleMessage> = {
    validFrom: { accessor: 'validFromDate' },
    validTo: { accessor: 'validToDate' },
    electricitySupplier: { accessor: 'supplier' },
    balanceResponsible: { accessor: 'balanceResponsible' },
    gridArea: { accessor: 'gridArea' },
    meteringPointType: { accessor: 'meteringPointType' },
    received: { accessor: 'receivedDateTime' },
  };

  translateHeader = (columnId: string): string => {
    const baseKey = 'eSett.balanceResponsible.columns';

    return translate(`${baseKey}.${columnId}`);
  };

  @Input() isLoading!: boolean;
  @Input() hasError!: boolean;

  @Input() tableDataSource!: WattTableDataSource<DhBalanceResponsibleMessage>;

  onRowClick(activeRow: DhBalanceResponsibleMessage): void {
    this.activeRow = activeRow;

    this.drawer?.open(activeRow);
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
