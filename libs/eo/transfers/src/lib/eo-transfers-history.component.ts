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
import { LowerCasePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, inject, signal } from '@angular/core';

import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import {
  EoListedTransfer,
  EoTransferAgreementsHistory,
  EoTransfersService,
} from './eo-transfers.service';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-history',
  imports: [
    LowerCasePipe,
    NgIf,
    WATT_TABLE,
    WattBadgeComponent,
    WattButtonComponent,
    WattDatePipe,
    WattEmptyStateComponent,
    WattPaginatorComponent,
  ],
  styles: [
    `
      h3,
      watt-empty-state {
        margin-bottom: var(--watt-space-m);
      }

      h3 {
        display: flex;
        align-items: center;
      }

      watt-badge {
        margin-left: var(--watt-space-s);
        border-radius: 50%;
        color: var(--watt-on-light-high-emphasis);
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 9999px;
        min-width: 28px;
        padding: var(--watt-space-xs) var(--watt-space-s);
      }

      .spinner-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--watt-space-xl);
      }
    `,
  ],
  standalone: true,
  template: `
    <h3>
      Changes <watt-badge type="neutral">{{ dataSource.data.length }}</watt-badge>
    </h3>

    <watt-table
      #table
      [columns]="columns"
      [loading]="transferHistoryState().loading"
      [dataSource]="dataSource"
      sortBy="createdAt"
      sortDirection="desc"
      [sortClear]="false"
      class="watt-space-stack-s"
      data-testid="transfers-table"
    >
      <!-- Period - Custom column -->
      <ng-container *wattTableCell="table.columns['createdAt']; let element">
        {{ element.createdAt | wattDate: 'long' }}
      </ng-container>

      <!-- Status - Custom column -->
      <ng-container *wattTableCell="table.columns['action']; let element">
        <strong>{{ element.actorName || element.transferAgreement.senderName }}</strong> has
        {{ element.action | lowercase }}
        <span *ngIf="element.action === 'Updated'">
          <span *ngIf="element.transferAgreement.endDate">
            the end date to
            <strong>{{ element.transferAgreement.endDate | wattDate: 'long' }}</strong>
          </span>
          <span *ngIf="!element.transferAgreement.endDate">
            the transfer agreement to have <strong>no end date</strong>
          </span>
        </span>
        <span *ngIf="element.action === 'Created'"> the transfer agreement</span>
      </ng-container>
    </watt-table>

    <watt-empty-state
      *ngIf="
        dataSource.data.length === 0 &&
        !transferHistoryState().error &&
        !transferHistoryState().loading
      "
      icon="power"
      title="No history was found"
    />

    <watt-empty-state
      *ngIf="transferHistoryState().error"
      icon="power"
      title="An unexpected error occured"
      message="Try again or contact your system administrator if you keep getting this error."
    >
      <watt-button (click)="getHistory(transfer?.id)">Try again</watt-button>
    </watt-empty-state>

    <watt-paginator
      data-testid="table-paginator"
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [for]="dataSource"
    />
  `,
})
export class EoTransfersHistoryComponent implements OnChanges {
  @Input() transfer?: EoListedTransfer;

  private transferService = inject(EoTransfersService);

  protected dataSource = new WattTableDataSource<EoTransferAgreementsHistory>();
  protected columns = {
    createdAt: { accessor: 'createdAt', header: 'Time' },
    action: { accessor: 'action', header: 'Change' },
  } as WattTableColumnDef<EoTransferAgreementsHistory>;

  protected transferHistoryState = signal<{ loading: boolean; error: HttpErrorResponse | null }>({
    loading: false,
    error: null,
  });

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['transfer']?.currentValue) return;
    this.getHistory(this.transfer?.id);
  }

  getHistory(transferAgreementId?: string): void {
    if (!transferAgreementId) return;

    this.transferHistoryState.set({ loading: true, error: null });

    this.transferService.getHistory(transferAgreementId).subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.transferHistoryState.set({ loading: false, error: null });
      },
      error: (error: HttpErrorResponse) => {
        this.transferHistoryState.set({ loading: false, error });
      },
    });
  }
}
