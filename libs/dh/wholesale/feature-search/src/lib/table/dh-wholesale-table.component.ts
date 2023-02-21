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
  inject,
} from '@angular/core';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import {
  WATT_TABLE,
  WattTableDataSource,
  WattTableColumnDef,
} from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';

import { graphql } from '@energinet-datahub/dh/shared/domain';
// import { batch } from '@energinet-datahub/dh/wholesale/domain';
import { PushModule } from '@rx-angular/template/push';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';

type Batch = Omit<graphql.Batch, 'gridAreas'>;
type wholesaleTableData = WattTableDataSource<Batch>;

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    PushModule,
    DhSharedUiDateTimeModule,
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
  private store = inject(DhWholesaleBatchDataAccessApiStore);

  @Input()
  selectedBatch?: Batch;

  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;

  @Input() set data(batches: Batch[]) {
    this._data = new WattTableDataSource(batches);
  }

  @Output() selectedRow: EventEmitter<Batch> = new EventEmitter();
  @Output() download: EventEmitter<Batch> = new EventEmitter();

  _data: wholesaleTableData = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<Batch> = {
    batchId: { accessor: 'id' },
    periodFrom: { accessor: (batch) => batch.period?.start },
    periodTo: { accessor: (batch) => batch.period?.end },
    executionTime: { accessor: 'executionTimeStart' },
    status: { accessor: 'executionState' },
    basisData: { accessor: 'isBasisDataDownloadAvailable' },
  };

  translateHeader = (key: string) =>
    translate(`wholesale.searchBatch.columns.${key}`);

  isSelectedBatch = (currentBatch: Batch, activeBatch: Batch) =>
    currentBatch.id === activeBatch.id;

  ngAfterViewInit() {
    if (this._data === null) return;
    this._data.paginator = this.paginator.instance;
  }

  onDownload(event: Event, batch: Batch) {
    event.stopPropagation();
    this.download.emit(batch);
  }
}
