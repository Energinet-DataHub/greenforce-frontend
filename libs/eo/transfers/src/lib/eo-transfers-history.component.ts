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
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';

import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { EoTransfersStore } from './eo-transfers.store';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-history',
  imports: [
    WATT_TABLE,
    WattPaginatorComponent,
    NgIf,
    WattEmptyStateComponent,
    PushModule,
    WattButtonComponent,
    WattSpinnerComponent,
  ],
  styles: [
    `
      h3,
      watt-empty-state {
        margin-bottom: var(--watt-space-m);
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
    <h3>Changes: {{ dataSource.data.length }}</h3>

    <watt-table
      #table
      [columns]="columns"
      [dataSource]="dataSource"
      sortBy="recipient"
      sortDirection="asc"
      [sortClear]="false"
      class="watt-space-stack-s"
      data-testid="transfers-table"
    >
      <!-- Period - Custom column -->
      <ng-container *wattTableCell="table.columns['time']; let element"> time </ng-container>

      <!-- Status - Custom column -->
      <ng-container *wattTableCell="table.columns['change']; let element"> change </ng-container>
    </watt-table>

    <div class="spinner-container" *ngIf="isLoading$ | push">
      <watt-spinner></watt-spinner>
    </div>

    <watt-empty-state
      *ngIf="hasError$ | push"
      icon="power"
      title="An unexpected error occured"
      message="Try again or contact your system administrator if you keep getting this error."
    >
      <watt-button (click)="getHistory()">Try again</watt-button>
    </watt-empty-state>

    <watt-paginator
      data-testid="table-paginator"
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [for]="dataSource"
    >
    </watt-paginator>
  `,
})
export class EoTransfersHistoryComponent implements OnInit {
  @Input() transferAgreementId?: string;

  dataSource = new WattTableDataSource<{ time: string; change: string }>();
  columns = {
    time: { accessor: 'time' },
    change: { accessor: 'change' },
  } as WattTableColumnDef<{ time: string; change: string }>;
  store = inject(EoTransfersStore);

  hasError$ = this.store.historyOfSelectedTransferError$;
  isLoading$ = this.store.historyOfSelectedTransferLoading$;

  ngOnInit(): void {
    this.getHistory();
  }

  getHistory(): void {
    if (this.transferAgreementId) {
      this.store.getHistory(this.transferAgreementId);
    }
  }
}
