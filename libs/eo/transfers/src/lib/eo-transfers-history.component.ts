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
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { EoTransfersStore } from './eo-transfers.store';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { EoTransferAgreementsHistory } from './eo-transfers.service';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-history',
  imports: [
    LowerCasePipe,
    NgIf,
    RxPush,
    WATT_TABLE,
    WattBadgeComponent,
    WattButtonComponent,
    WattDatePipe,
    WattEmptyStateComponent,
    WattPaginatorComponent,
    WattSpinnerComponent,
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

    <div class="spinner-container" *ngIf="isLoading$ | push">
      <watt-spinner />
    </div>

    <watt-empty-state
      *ngIf="dataSource.data.length === 0 && !(hasError$ | push) && !(isLoading$ | push)"
      icon="power"
      title="No history was found"
    />

    <watt-empty-state
      *ngIf="hasError$ | push"
      icon="power"
      title="An unexpected error occured"
      message="Try again or contact your system administrator if you keep getting this error."
    >
      <watt-button (click)="getHistory(transferAgreementId)">Try again</watt-button>
    </watt-empty-state>

    <watt-paginator
      data-testid="table-paginator"
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [for]="dataSource"
    />
  `,
})
export class EoTransfersHistoryComponent implements OnInit {
  private _store = inject(EoTransfersStore);
  private _destroyRef = inject(DestroyRef);

  transferAgreementId?: string;
  dataSource = new WattTableDataSource<EoTransferAgreementsHistory>();
  columns = {
    createdAt: { accessor: 'createdAt', header: 'Time' },
    action: { accessor: 'action', header: 'Change' },
  } as WattTableColumnDef<EoTransferAgreementsHistory>;

  hasError$ = this._store.historyOfSelectedTransferError$;
  isLoading$ = this._store.historyOfSelectedTransferLoading$;

  ngOnInit(): void {
    this._store.selectedTransfer$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((transfer) => {
        if (transfer) {
          this.transferAgreementId = transfer.id;
          this.getHistory(this.transferAgreementId);
        }
      });

    this._store.historyOfSelectedTransfer$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((history) => {
        this.dataSource.data = history;
      });
  }

  getHistory(transferAgreementId?: string): void {
    if (transferAgreementId) {
      this._store.getHistory(transferAgreementId);
    }
  }
}
