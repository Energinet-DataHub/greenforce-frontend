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
import { DatePipe, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { EoTransfer } from './eo-transfers.service';
import { EoTransferStore } from './eo-transfers.store';

interface EoTransferTableElement extends EoTransfer {
  period?: string;
  status?: boolean;
}

@Component({
  selector: 'eo-transfer-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    DatePipe,
    WattBadgeComponent,
    NgIf,
    WattButtonComponent,
    WATT_TABLE,
    WattPaginatorComponent,
  ],
  standalone: true,
  styles: [
    `
      .card-header {
        display: flex;
        justify-content: space-between;

        .actions {
          gap: 16px;
          display: flex;
        }
      }
    `,
  ],
  template: `
    <div class="card-header watt-space-stack-m">
      <h3>Transfer Agreements</h3>
      <div class="actions">
        <watt-button
          data-testid="download-button"
          [disabled]="true"
          icon="fileDownload"
          variant="text"
          >Download</watt-button
        >
        <watt-button
          data-testid="new-agreement-button"
          [disabled]="true"
          icon="plus"
          variant="secondary"
        >
          New transfer agreement
        </watt-button>
      </div>
    </div>
    <watt-table
      #table
      [columns]="columns"
      [dataSource]="dataSource"
      sortBy="recipient"
      sortDirection="asc"
      [sortClear]="false"
    >
      <!-- Period - Custom column -->
      <ng-container *wattTableCell="table.columns['period']; let element">
        {{ element.dateFrom | date : 'dd/MM/yyyy' }} - {{ element.dateTo | date : 'dd/MM/yyyy' }}
      </ng-container>

      <!-- Status - Custom column -->
      <ng-container *wattTableCell="table.columns['status']; let element">
        <watt-badge *ngIf="isDateActive(element.dateTo); else notActive" type="success">
          Active
        </watt-badge>
      </ng-container>
    </watt-table>

    <!-- No Data to show -->
    <p *ngIf="dataSource.data.length < 1" style="text-align: center;margin: 10px 0;">
      You do not have any transfer agreements to show right now.
    </p>

    <watt-paginator [pageSize]="10" [pageSizeOptions]="[10, 25, 50, 100, 250]" [for]="dataSource">
    </watt-paginator>
    <ng-template #notActive><watt-badge type="neutral">Inactive</watt-badge></ng-template>
  `,
})
export class EoTransferTableComponent implements AfterViewInit {
  dataSource = new WattTableDataSource<EoTransferTableElement>();
  columns = {
    recipient: { accessor: 'recipient' },
    period: { accessor: (transfer) => transfer.dateFrom },
    status: { accessor: (transfer) => this.isDateActive(transfer.dateTo) },
  } as WattTableColumnDef<EoTransferTableElement>;

  constructor(private store: EoTransferStore) {}

  ngAfterViewInit() {
    this.populateTable();
  }

  populateTable() {
    this.store.transfers$.subscribe((transfers) => (this.dataSource.data = transfers));
  }

  isDateActive(date: number): boolean {
    return new Date(date).getTime() >= new Date().getTime();
  }
}
