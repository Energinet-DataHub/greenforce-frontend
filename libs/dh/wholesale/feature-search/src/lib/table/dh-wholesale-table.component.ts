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
import { Component, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import {
  MatPaginator,
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { takeUntil, Subject } from 'rxjs';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { WattBadgeModule, WattBadgeType } from '@energinet-datahub/watt';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import {
  WholesaleSearchBatchResponseDto,
  WholesaleStatus,
} from '@energinet-datahub/dh/shared/domain';

type wholesaleTableData = MatTableDataSource<{
  statusType: void | WattBadgeType;
  batchNumber: string;
  periodFrom: string;
  periodTo: string;
  executionTime: string;
  status: WholesaleStatus;
}>;

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
export class DhWholesaleTableComponent implements OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() set data(batches: WholesaleSearchBatchResponseDto[]) {
    this._data = new MatTableDataSource(
      batches.map((batch) => ({
        ...batch,
        statusType: this.getStatusType(batch.status),
      }))
    );
  }
  destroy$ = new Subject<void>();
  _data: wholesaleTableData | null = null;

  constructor(
    private store: DhWholesaleBatchDataAccessApiStore,
    private matPaginatorIntl: MatPaginatorIntl,
    private translocoService: TranslocoService
  ) {}

  ngAfterViewInit() {
    this.setupPaginator();
  }

  columnIds = [
    'batchNumber',
    'periodFrom',
    'periodTo',
    'executionTime',
    'status',
  ];

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  private setupPaginator() {
    this.matPaginatorIntl.getRangeLabel = (page, pageSize, length) => {
      const seperator = this.translocoService.translate(
        'wholesale.searchBatch.paginator.of'
      );

      if (length == 0 || pageSize == 0) {
        return `0 ${seperator} ${length}`;
      }

      length = Math.max(length, 0);

      const startIndex = page * pageSize;

      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;

      return `${startIndex + 1} – ${endIndex} ${seperator} ${length}`;
    };

    this.translocoService
      .selectTranslateObject('wholesale.searchBatch.paginator')
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.matPaginatorIntl.itemsPerPageLabel = value.itemsPerPageLabel;
        this.matPaginatorIntl.nextPageLabel = value.next;
        this.matPaginatorIntl.previousPageLabel = value.previous;
        this.matPaginatorIntl.firstPageLabel = value.first;
        this.matPaginatorIntl.lastPageLabel = value.last;

        if (this._data === null) return;
        this._data.paginator = this.paginator;
      });
  }
}
