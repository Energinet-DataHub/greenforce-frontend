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
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { first, of } from 'rxjs';

import { BatchDtoV2, BatchState, BatchGridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { WattBadgeModule, WattBadgeType } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';

type wholesaleTableData = MatTableDataSource<{
  statusType: void | WattBadgeType;
  batchNumber: string;
  periodStart: string;
  periodEnd: string;
  executionTimeStart?: string | null;
  executionTimeEnd?: string | null;
  executionState: BatchState;
  isBasisDataDownloadAvailable: boolean;
  batchGridAreas: Array<BatchGridAreaDto>
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
    DhSharedUiPaginatorComponent,
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
  @Input() set data(batches: BatchDtoV2[]) {
    this._data = new MatTableDataSource(
      batches.map((batch) => ({
        ...batch,
        statusType: this.getStatusType(batch.executionState),
      }))
    );
  }
  _data: wholesaleTableData = new MatTableDataSource(undefined);

  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private toastService = inject(WattToastService);
  private translations = inject(TranslocoService);

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
    this._data.paginator = this.paginator.instance;
  }

  onDownload(batch: BatchDtoV2) {
    this.store.getZippedBasisData(of(batch));
    this.store.loadingBasisDataErrorTrigger$.pipe(first()).subscribe(() => {
      this.toastService.open({
        message: this.translations.translate(
          'wholesale.searchBatch.downloadFailed'
        ),
        type: 'danger',
      });
    });
  }

  private getStatusType(status: BatchState): WattBadgeType | void {
    if (status === BatchState.Pending) {
      return 'warning';
    } else if (status === BatchState.Completed) {
      return 'success';
    } else if (status === BatchState.Executing) {
      return 'info';
    } else if (status === BatchState.Failed) {
      return 'danger';
    }
  }
}
