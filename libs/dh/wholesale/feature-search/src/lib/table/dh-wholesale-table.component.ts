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
import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import {
  WattBadgeModule,
  WattBadgeType,
} from '@energinet-datahub/watt';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import {
  WholesaleSearchBatchResponseDto,
  WholesaleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

type wholesaleTableData = MatTableDataSource<{ statusType: void | WattBadgeType; batchNumber: string; periodFrom: string; periodTo: string; executionTime: string; status: WholesaleStatus; }>

@Component({
  standalone: true,
  imports: [
    TranslocoModule,
    MatTableModule,
    CommonModule,
    WattBadgeModule,
    DhSharedUiDateTimeModule,
    MatPaginatorModule,
  ],
  selector: 'dh-wholesale-table',
  templateUrl: './dh-wholesale-table.component.html',
  styleUrls: ['./dh-wholesale-table.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
})
export class DhWholesaleTableComponent {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @Input() set data(batches: WholesaleSearchBatchResponseDto[]){
        this._data = new MatTableDataSource(
            batches.map((batch) => ({
              ...batch,
              statusType: this.getStatusType(batch.status),
            }))
          );
    }
    _data: wholesaleTableData | null = null;
  constructor(private store: DhWholesaleBatchDataAccessApiStore) {}

  ngAfterViewInit() {
    if (this._data === null) return
    this._data.paginator = this.paginator;
  }

  columnIds = [
    'batchNumber',
    'periodFrom',
    'periodTo',
    'executionTime',
    'status',
  ];

  private getStatusType(status: WholesaleStatus): WattBadgeType | void {
    if (status === WholesaleStatus.Pending) {
      return 'warning';
    } else if (status === WholesaleStatus.Running) {
      return 'success';
    } else if (status === WholesaleStatus.Finished) {
      return 'info';
    } else if (status === WholesaleStatus.Failed) {
      return 'danger';
    }
  }
}