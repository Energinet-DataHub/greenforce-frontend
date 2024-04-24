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
import { Component, effect, input } from '@angular/core';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import {
  DhBalanceResponsibleAgreement,
  DhBalanceResponsibleAgreements,
} from '../dh-balance-responsible-relation';
import { DhBalanceResponsibleRelationStatusComponent } from '../status/dh-balance-responsible-relation-status.component';

@Component({
  selector: 'dh-balance-responsible-relations-table',
  standalone: true,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-table
      [dataSource]="tableDataSource"
      [columns]="columns"
      [sortClear]="false"
      [suppressRowHoverHighlight]="true"
      [hideColumnHeaders]="true"
    >
      <ng-container *wattTableCell="columns['period']; let entry">
        {{ entry.validPeriod.start | wattDate: 'short' }}
        @if (entry.validPeriod.end) {
          -
          {{ entry.validPeriod.end | wattDate: 'short' }}
        }
      </ng-container>

      <ng-container *wattTableCell="columns['status']; let entry">
        <dh-balance-responsible-relation-status [status]="entry.status" />
      </ng-container>
    </watt-table>
  `,
  imports: [WATT_TABLE, WattDatePipe, DhBalanceResponsibleRelationStatusComponent],
})
export class DhBalanceResponsibleRelationsTableComponent {
  tableDataSource = new WattTableDataSource<DhBalanceResponsibleAgreement>([]);

  columns: WattTableColumnDef<DhBalanceResponsibleAgreement> = {
    gridArea: { accessor: 'gridAreaId' },
    period: { accessor: null },
    status: { accessor: null },
  };

  data = input.required<DhBalanceResponsibleAgreements>();

  constructor() {
    effect(() => {
      this.tableDataSource.data = this.data();
    });
  }
}
