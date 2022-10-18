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
import {
  Component,
  Input,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { takeUntil, Subject } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import {
  WattBadgeModule,
  WattBadgeType,
  WattButtonModule,
  WattEmptyStateModule,
} from '@energinet-datahub/watt';

import {
  BatchDtoV2,
  BatchExecutionState,
} from '@energinet-datahub/dh/shared/domain';

type wholesaleTableData = MatTableDataSource<{
  statusType: void | WattBadgeType;
  batchNumber: number;
  periodStart: string;
  periodEnd: string;
  executionTimeStart?: string | null;
  executionTimeEnd?: string | null;
  executionState: BatchExecutionState;
}>;

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DhSharedUiDateTimeModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    TranslocoModule,
    WattBadgeModule,
    WattButtonModule,
    WattEmptyStateModule,
  ],
  selector: 'dh-wholesale-table',
  templateUrl: './dh-wholesale-table.component.html',
  styleUrls: ['./dh-wholesale-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleTableComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() set data(batches: BatchDto[]) {
    this._data = new MatTableDataSource(
      batches.map((batch) => ({
        ...batch,
        statusType: this.getStatusType(batch.executionState),
      }))
    );
  }
  destroy$ = new Subject<void>();
  _data: wholesaleTableData = new MatTableDataSource(undefined);

  constructor(
    private matPaginatorIntl: MatPaginatorIntl,
    private translocoService: TranslocoService
  ) {}

  columnIds = [
    'batchNumber',
    'periodStart',
    'periodEnd',
    'executionTimeStart',
    'executionState',
    'basisData',
  ];

  ngAfterViewInit() {
    this.setupPaginator();
    if (this._data === null) return;
    this._data.sort = this.sort;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getStatusType(status: BatchExecutionState): WattBadgeType | void {
    if (status === BatchExecutionState.Pending) {
      return 'warning';
    } else if (status === BatchExecutionState.Completed) {
      return 'success';
    } else if (status === BatchExecutionState.Executing) {
      return 'info';
    } else if (status === BatchExecutionState.Failed) {
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
