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
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

import { EoListedTransfer } from './eo-transfers.service';
import { EoTransfersCreateModalComponent } from './eo-transfers-create-modal.component';
import { EoTransfersDrawerComponent } from './eo-transfers-drawer.component';
import { SharedUtilities } from '@energinet-datahub/eo/shared/utilities';
import { EoTransfersWalletModalComponent } from './eo-transfers-wallet-modal-component';

interface EoTransferTableElement extends EoListedTransfer {
  period?: string;
  status?: boolean;
}

@Component({
  selector: 'eo-transfers-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WATT_TABLE,
    WattBadgeComponent,
    WattButtonComponent,
    WattPaginatorComponent,
    WattDropdownComponent,
    ReactiveFormsModule,
    EoTransfersDrawerComponent,
    EoTransfersCreateModalComponent,
    EoTransfersWalletModalComponent,
    WattDatePipe,
    NgIf,
  ],
  styles: [
    `
      .card-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .actions {
          gap: 16px;
          display: flex;
          flex-wrap: wrap;
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

      .no-data {
        text-align: center;
        padding: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <div class="card-header">
      <h3>Transfer agreements</h3>
      <div class="actions">
        <watt-button
          data-testid="new-agreement-button"
          icon="plus"
          variant="secondary"
          (click)="transfersModal.open()"
        >
          New transfer agreement
        </watt-button>

        <watt-button
          data-testid="create-wallet-endpoint-button"
          icon="plus"
          variant="secondary"
          (click)="transfersWalletModalComponent.open()"
        >
          Create Wallet Endpoint
        </watt-button>
      </div>
    </div>
    <div class="search-filters watt-space-stack-s">
      <form [formGroup]="filterForm">
        <watt-dropdown
          [chipMode]="true"
          placeholder="Status"
          formControlName="statusFilter"
          (ngModelChange)="applyFilters()"
          [options]="[
            { value: 'true', displayValue: 'Active' },
            { value: 'false', displayValue: 'Inactive' }
          ]"
        ></watt-dropdown>
      </form>
    </div>
    <watt-table
      #table
      [loading]="loading"
      [columns]="columns"
      [dataSource]="dataSource"
      sortBy="status"
      sortDirection="desc"
      [sortClear]="false"
      (rowClick)="onRowClick($event)"
      [activeRow]="activeRow"
      class="watt-space-stack-s"
      data-testid="transfers-table"
    >
      <ng-container *wattTableCell="table.columns['startDate']; let element">
        {{ element.startDate | wattDate : 'long' }}
      </ng-container>

      <ng-container *wattTableCell="table.columns['endDate']; let element">
        {{ (element.endDate | wattDate : 'long') || ' — ' }}
      </ng-container>

      <!-- Status - Custom column -->
      <ng-container *wattTableCell="table.columns['status']; let element">
        <watt-badge
          *ngIf="utils.isDateActive(element.startDate, element.endDate); else notActive"
          type="success"
        >
          Active
        </watt-badge>
      </ng-container>
    </watt-table>

    <!-- No Data to show -->
    <p *ngIf="dataSource.data.length < 1 && hasLoaded" class="watt-space-stack-s no-data">
      You do not have any transfer agreements to show right now.
    </p>

    <watt-paginator
      data-testid="table-paginator"
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [for]="dataSource"
    >
    </watt-paginator>
    <ng-template #notActive><watt-badge type="neutral">Inactive</watt-badge></ng-template>

    <eo-transfers-create-modal></eo-transfers-create-modal>
    <eo-transfers-wallet-modal></eo-transfers-wallet-modal>
    <eo-transfers-drawer
      [transfer]="selectedTransfer"
      (closed)="transferSelected.emit(undefined)"
    ></eo-transfers-drawer>
  `,
})
export class EoTransfersTableComponent implements OnChanges {
  @Input() transfers: EoListedTransfer[] = [];
  @Input() loading = false;
  @Input() selectedTransfer?: EoListedTransfer;
  @Output() transferSelected = new EventEmitter<EoListedTransfer>();

  @ViewChild(EoTransfersDrawerComponent) transfersDrawer!: EoTransfersDrawerComponent;
  @ViewChild(EoTransfersCreateModalComponent) transfersModal!: EoTransfersCreateModalComponent;
  @ViewChild(EoTransfersWalletModalComponent)
  transfersWalletModalComponent!: EoTransfersWalletModalComponent;

  utils = inject(SharedUtilities);
  private fb = inject(FormBuilder);

  filterForm = this.fb.group({ statusFilter: '' });
  activeRow?: EoListedTransfer;
  dataSource = new WattTableDataSource<EoTransferTableElement>();
  columns = {
    receiver: { accessor: 'receiverTin' },
    startDate: { accessor: 'startDate', header: 'Start Date' },
    endDate: { accessor: 'endDate', header: 'End Date' },
    status: {
      accessor: (transfer) =>
        transfer.endDate ? this.utils.isDateActive(transfer.startDate, transfer.endDate) : true,
    },
  } as WattTableColumnDef<EoTransferTableElement>;
  hasLoaded = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transfers']) {
      this.dataSource.data = this.transfers;

      // Ensure that the empty table message is only shown after the first load
      if (!changes['transfers'].isFirstChange()) {
        this.hasLoaded = true;
      }
    }

    /*
     * We need to set the active row here and not in the store,
     * because the table otherwise losses the active row ex. after editing a transfer
     */
    if (changes['selectedTransfer']) {
      this.activeRow = this.transfers.find((transfer) => transfer.id === this.selectedTransfer?.id);
    }
  }

  applyFilters() {
    this.dataSource.data = this.transfers.filter((transfer) =>
      this.filterByStatus(transfer.startDate, transfer.endDate)
    );
  }

  filterByStatus(startDate: number | null, endDate: number | null): boolean {
    if (this.filterForm.controls['statusFilter'].value === null || !startDate) return true;

    return (
      this.filterForm.controls['statusFilter'].value ===
      this.utils.isDateActive(startDate, endDate).toString()
    );
  }

  onRowClick(row: EoListedTransfer): void {
    this.transferSelected.emit(row);
    this.transfersDrawer.open();
  }
}
