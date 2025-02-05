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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { translations } from '@energinet-datahub/eo/translations';

import { EoListedTransfer } from './eo-transfers.service';
import { EoTransfersDrawerComponent } from './eo-transfers-drawer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EoTransferTableElement, TransferAgreementValues } from './eo-transfers.component';

@Component({
  selector: 'eo-transfers-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WATT_TABLE,
    WattBadgeComponent,
    WattPaginatorComponent,
    ReactiveFormsModule,
    EoTransfersDrawerComponent,
    WattDatePipe,
    TranslocoPipe,
  ],
  styles: [
    `
      .no-data {
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
    @if (columns) {
      <watt-table
        #table
        [loading]="loading()"
        [columns]="columns"
        [dataSource]="dataSource()"
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
    @if (dataSource().data.length < 1 && !loading()) {
      <p class="watt-space-stack-s no-data">
        {{ translations.transfers.noData.title | transloco }}
      </p>
    }

    <watt-paginator
      data-testid="table-paginator"
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [for]="dataSource()"
    />

    <eo-transfers-drawer
      [transferAgreements]="transfers()"
      [transfer]="selectedTransfer()"
      (closed)="transferSelected.emit(undefined)"
      (removeProposal)="removeProposal.emit($event)"
      (saveTransferAgreement)="saveTransferAgreement.emit($event)"
    />
  `,
})
export class EoTransfersTableComponent implements OnInit {
  transfers = input.required<EoListedTransfer[]>();
  loading = input<boolean>(false);
  selectedTransfer = input<EoListedTransfer>();
  dataSource = input.required<WattTableDataSource<EoTransferTableElement>>();

  transferSelected = output<EoListedTransfer | undefined>();
  saveTransferAgreement = output<TransferAgreementValues>();
  removeProposal = output<string | undefined>();

  @ViewChild(EoTransfersDrawerComponent) transfersDrawer!: EoTransfersDrawerComponent;

  protected translations = translations;
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  activeRow?: EoListedTransfer;
  columns!: WattTableColumnDef<EoTransferTableElement>;

  constructor() {
    effect(() => {
      this.dataSource().data = this.transfers();
      /*
       * We need to set the active row here and not in the store,
       * because the table otherwise loses the active row ex. after editing a transfer
       */
      this.activeRow = this.transfers().find(
        (transfer) => transfer.id === this.selectedTransfer()?.id
      );
    });
  }

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

  onRowClick(row: EoListedTransfer): void {
    this.transferSelected.emit(row);
    this.transfersDrawer.open();
  }
}
