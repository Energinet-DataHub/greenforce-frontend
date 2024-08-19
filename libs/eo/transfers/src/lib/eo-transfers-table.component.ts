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
  OnInit,
  ChangeDetectorRef,
  DestroyRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import {
  WATT_TABLE,
  WattTableColumnDef,
  WattTableDataSource,
  WattPaginatorComponent,
} from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { translations } from '@energinet-datahub/eo/translations';
import { SharedUtilities } from '@energinet-datahub/eo/shared/utilities';

import { EoListedTransfer } from './eo-transfers.service';
import { EoTransfersCreateModalComponent } from './eo-transfers-create-modal.component';
import { EoTransfersDrawerComponent } from './eo-transfers-drawer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface EoTransferTableElement extends EoListedTransfer {
  period?: string;
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
    WattDatePipe,
    TranslocoPipe,
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

      .noData {
        text-align: center;
        padding: var(--watt-space-m);
      }

      watt-paginator {
        display: block;
        margin: -8px -24px -24px -24px;
      }
    `,
  ],
  template: `
    <div class="card-header">
      <h3>{{ translations.transfers.tableTitle | transloco }}</h3>
      <div class="actions">
        <watt-button
          data-testid="new-agreement-button"
          icon="plus"
          variant="secondary"
          [disabled]="!enableCreateTransferAgreementProposal"
          (click)="transfersModal.open()"
        >
          {{ translations.transfers.createNewTransferAgreement | transloco }}
        </watt-button>
      </div>
    </div>
    <div class="watt-space-stack-s">
      <form [formGroup]="filterForm">
        <watt-dropdown
          [chipMode]="true"
          [placeholder]="translations.transfers.transferAgreementStatusFilterLabel | transloco"
          formControlName="statusFilter"
          (ngModelChange)="applyFilters()"
          [options]="[
            {
              value: 'true',
              displayValue: translations.transfers.activeTransferAgreement | transloco,
            },
            {
              value: 'false',
              displayValue: translations.transfers.inactiveTransferAgreement | transloco,
            },
          ]"
        />
      </form>
    </div>
    @if (columns) {
      <watt-table
        #table
        [loading]="loading"
        [columns]="columns"
        [dataSource]="dataSource"
        sortBy="status"
        sortDirection="asc"
        [sortClear]="false"
        (rowClick)="onRowClick($event)"
        [activeRow]="activeRow"
        class="watt-space-stack-s"
        data-testid="transfers-table"
      >
        <ng-container *wattTableCell="table.columns['startDate']; let element">
          {{ element.startDate | wattDate: 'long' }}
        </ng-container>

        <ng-container *wattTableCell="table.columns['endDate']; let element">
          {{ (element.endDate | wattDate: 'long') || ' — ' }}
        </ng-container>

        <!-- Status - Custom column -->
        <ng-container *wattTableCell="table.columns['status']; let element">
          @if (element.transferAgreementStatus === 'Active') {
            <watt-badge type="success">{{
              translations.transfers.activeTransferAgreement | transloco
            }}</watt-badge>
          } @else if (element.transferAgreementStatus === 'Proposal') {
            <watt-badge type="warning">{{
              translations.transfers.pendingTransferAgreement | transloco
            }}</watt-badge>
          } @else if (element.transferAgreementStatus === 'ProposalExpired') {
            <watt-badge type="neutral">{{
              translations.transfers.expiredTransferAgreementProposals | transloco
            }}</watt-badge>
          } @else {
            <watt-badge type="neutral">{{
              translations.transfers.inactiveTransferAgreement | transloco
            }}</watt-badge>
          }
        </ng-container>
      </watt-table>
    }

    <!-- No Data to show -->
    @if (dataSource.data.length < 1 && hasLoaded) {
      <p class="watt-space-stack-s no-data">
        {{ translations.transfers.noData.title | transloco }}
      </p>
    }

    <watt-paginator
      data-testid="table-paginator"
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [for]="dataSource"
    />

    <eo-transfers-create-modal
      [transferAgreements]="transfers"
      (proposalCreated)="proposalCreated.emit($event)"
    />
    <eo-transfers-drawer
      [transferAgreements]="transfers"
      [transfer]="selectedTransfer"
      (closed)="transferSelected.emit(undefined)"
      (removeProposal)="removeProposal.emit($event)"
      (saveTransferAgreement)="saveTransferAgreement.emit($event)"
    />
  `,
})
export class EoTransfersTableComponent implements OnInit, OnChanges {
  @Input() transfers: EoListedTransfer[] = [];
  @Input() loading = false;
  @Input() enableCreateTransferAgreementProposal = false;
  @Input() selectedTransfer?: EoListedTransfer;
  @Output() transferSelected = new EventEmitter<EoListedTransfer>();
  @Output() saveTransferAgreement = new EventEmitter();
  @Output() removeProposal = new EventEmitter<string>();
  @Output() proposalCreated = new EventEmitter<EoListedTransfer>();

  @ViewChild(EoTransfersDrawerComponent) transfersDrawer!: EoTransfersDrawerComponent;
  @ViewChild(EoTransfersCreateModalComponent) transfersModal!: EoTransfersCreateModalComponent;

  protected translations = translations;
  protected utils = inject(SharedUtilities);
  private fb = inject(FormBuilder);
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  filterForm = this.fb.group({ statusFilter: '' });
  activeRow?: EoListedTransfer;
  dataSource = new WattTableDataSource<EoTransferTableElement>();
  columns!: WattTableColumnDef<EoTransferTableElement>;
  hasLoaded = false;

  ngOnInit(): void {
    this.setColumns();
  }

  private setColumns() {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.columns = {
          sender: {
            accessor: (transfer) => {
              const unknownSender = this.transloco.translate(
                this.translations.transfers.unknownSender
              );
              return `${transfer.senderName ?? unknownSender} (${transfer.senderTin})`;
            },
            header: this.transloco.translate(this.translations.transfers.senderTableHeader),
          },
          receiver: {
            accessor: (transfer) => {
              const unknownReceiver = this.transloco.translate(
                this.translations.transfers.unknownReceiver
              );
              if (!transfer.receiverTin) {
                return unknownReceiver;
              }
              return `${transfer.receiverName ?? unknownReceiver} (${transfer.receiverTin})`;
            },
            header: this.transloco.translate(this.translations.transfers.receiverTableHeader),
          },
          startDate: {
            accessor: 'startDate',
            header: this.transloco.translate(this.translations.transfers.startDateTableHeader),
          },
          endDate: {
            accessor: 'endDate',
            header: this.transloco.translate(this.translations.transfers.endDateTableHeader),
          },
          status: {
            accessor: (transfer) => {
              return transfer.transferAgreementStatus;
            },
            header: this.transloco.translate(this.translations.transfers.statusTableHeader),
          },
        };
        this.cd.detectChanges();
      });
  }

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
