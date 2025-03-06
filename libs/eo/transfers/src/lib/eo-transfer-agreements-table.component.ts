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

import { EoTransferAgreementDrawerComponent } from './eo-transfer-agreement-drawer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EoTransferTableElement,
  TransferAgreementValues,
} from './eo-transfer-agreements.component';
import { ListedTransferAgreement } from './data/transfer-agreement.types';

@Component({
  selector: 'eo-transfers-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WATT_TABLE,
    WattBadgeComponent,
    WattPaginatorComponent,
    ReactiveFormsModule,
    EoTransferAgreementDrawerComponent,
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
            <watt-badge type="success"
              >{{ translations.transfers.activeTransferAgreement | transloco }}
            </watt-badge>
          } @else if (element.transferAgreementStatus === 'Proposal') {
            <watt-badge type="warning"
              >{{ translations.transfers.pendingTransferAgreement | transloco }}
            </watt-badge>
          } @else if (element.transferAgreementStatus === 'ProposalExpired') {
            <watt-badge type="neutral"
              >{{ translations.transfers.expiredTransferAgreementProposals | transloco }}
            </watt-badge>
          } @else {
            <watt-badge type="neutral"
              >{{ translations.transfers.inactiveTransferAgreement | transloco }}
            </watt-badge>
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
      [transferAgreements]="transferAgreements()"
      [transfer]="selectedTransferAgreement()"
      (closed)="selectTransferAgreement.emit(undefined)"
      (removeProposal)="removeTransferAgreementProposal.emit($event)"
      (updateTransferAgreement)="updateTransferAgreement.emit($event)"
    />
  `,
})
export class EoTransferAgreementsTableComponent implements OnInit {
  transferAgreements = input.required<ListedTransferAgreement[]>();
  loading = input<boolean>(false);
  selectedTransferAgreement = input<ListedTransferAgreement>();
  dataSource = input.required<WattTableDataSource<EoTransferTableElement>>();

  selectTransferAgreement = output<ListedTransferAgreement | undefined>();
  updateTransferAgreement = output<TransferAgreementValues>();
  removeTransferAgreementProposal = output<string | undefined>();

  @ViewChild(EoTransferAgreementDrawerComponent)
  transferAgreementsDrawer!: EoTransferAgreementDrawerComponent;
  activeRow?: ListedTransferAgreement;
  columns!: WattTableColumnDef<EoTransferTableElement>;
  protected translations = translations;
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.dataSource().data = this.transferAgreements();
      /*
       * We need to set the active row here and not in the store,
       * because the table otherwise loses the active row ex. after editing a transfer
       */
      this.activeRow = this.transferAgreements().find(
        (transfer) => transfer.id === this.selectedTransferAgreement()?.id
      );
    });
  }

  ngOnInit(): void {
    this.setColumns();
  }

  onRowClick(row: ListedTransferAgreement): void {
    this.selectTransferAgreement.emit(row);
    this.transferAgreementsDrawer.open();
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
}
