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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
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
    DatePipe,
    NgIf,
    WattBadgeComponent,
    WattButtonComponent,
    WattPaginatorComponent,
    WattDropdownComponent,
    ReactiveFormsModule,
    WATT_FORM_FIELD,
    WATT_TABLE,
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

      .search-filters {
        watt-form-field {
          margin-top: 0;
        }

        ::ng-deep .mat-form-field-appearance-legacy .mat-form-field-wrapper {
          padding-bottom: 0;
        }

        ::ng-deep
          .mat-form-field-type-mat-select:not(.mat-form-field-disabled)
          .mat-form-field-flex {
          margin-top: 0;
        }
      }
    `,
  ],
  template: `
    <div class="card-header">
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
    <div class="search-filters watt-space-stack-s">
      <form [formGroup]="filterForm">
        <watt-form-field>
          <watt-dropdown
            [chipMode]="true"
            placeholder="Status"
            formControlName="statusFilter"
            [options]="[
              { value: 'true', displayValue: 'Active' },
              { value: 'false', displayValue: 'Inactive' }
            ]"
          ></watt-dropdown>
        </watt-form-field>
      </form>
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
  filterForm = this.fb.group({
    statusFilter: [{ value: '' }],
  });
  dataSource = new WattTableDataSource<EoTransferTableElement>();
  columns = {
    recipient: { accessor: 'recipient' },
    period: { accessor: (transfer) => transfer.dateFrom },
    status: { accessor: (transfer) => this.isDateActive(transfer.dateTo) },
  } as WattTableColumnDef<EoTransferTableElement>;

  constructor(private store: EoTransferStore, private fb: FormBuilder) {}

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
