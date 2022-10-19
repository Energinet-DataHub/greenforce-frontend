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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import {
  WattBadgeModule,
  WattBadgeType,
  WattButtonModule,
  WattEmptyStateModule,
} from '@energinet-datahub/watt';

import {
  BatchDto,
  BatchExecutionState,
} from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';

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
    MatSortModule,
    MatTableModule,
    TranslocoModule,
    WattBadgeModule,
    WattButtonModule,
    WattEmptyStateModule,
    DhSharedUiPaginatorComponent
  ],
  selector: 'dh-wholesale-table',
  templateUrl: './dh-wholesale-table.component.html',
  styleUrls: ['./dh-wholesale-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleTableComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(DhSharedUiPaginatorComponent) paginator!: DhSharedUiPaginatorComponent;
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

  columnIds = [
    'batchNumber',
    'periodStart',
    'periodEnd',
    'executionTimeStart',
    'executionState',
    'basisData',
  ];

  ngAfterViewInit() {
    if (this._data === null) return;
    this._data.sort = this.sort;
    this._data.paginator = this.paginator.getPaginator();
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
}
