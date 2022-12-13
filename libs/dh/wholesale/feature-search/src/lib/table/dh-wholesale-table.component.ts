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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';

import { BatchDto, BatchState } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import {
  WattBadgeComponent,
  WattBadgeType,
} from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';

export type BatchVm = BatchDto & { statusType: WattBadgeType };
type wholesaleTableData = MatTableDataSource<BatchVm>;

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DhSharedUiDateTimeModule,
    MatSortModule,
    MatTableModule,
    TranslocoModule,
    WattBadgeComponent,
    WattButtonModule,
    WattEmptyStateModule,
    DhSharedUiPaginatorComponent,
    WattCardModule,
  ],
  selector: 'dh-wholesale-table',
  templateUrl: './dh-wholesale-table.component.html',
  styleUrls: ['./dh-wholesale-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleTableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;

  @Input() set data(batches: BatchDto[]) {
    this._data = new MatTableDataSource(
      batches.map((batch) => ({
        ...batch,
        statusType: this.getStatusType(batch.executionState),
      }))
    );
  }
  @Output() selectedRow: EventEmitter<BatchVm> = new EventEmitter();
  @Output() download: EventEmitter<BatchVm> = new EventEmitter();

  _data: wholesaleTableData = new MatTableDataSource(undefined);
  columnIds = [
    'batchId',
    'periodStart',
    'periodEnd',
    'executionTimeStart',
    'executionState',
    'basisData',
  ];

  ngAfterViewInit() {
    if (this._data === null) return;
    this._data.sort = this.sort;
    this._data.paginator = this.paginator.instance;
  }

  onDownload(event: Event, batch: BatchVm) {
    event.stopPropagation();
    this.download.emit(batch);
  }

  private getStatusType(status: BatchState): WattBadgeType {
    if (status === BatchState.Pending) {
      return 'warning';
    } else if (status === BatchState.Completed) {
      return 'success';
    } else if (status === BatchState.Failed) {
      return 'danger';
    } else {
      return 'info';
    }
  }
}
