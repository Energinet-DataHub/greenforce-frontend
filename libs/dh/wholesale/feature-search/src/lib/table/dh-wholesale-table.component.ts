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
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { Batch } from '@energinet-datahub/dh/wholesale/domain';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

type wholesaleTableData = WattTableDataSource<Batch>;

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    WattDatePipe,
    TranslocoModule,
    WattBadgeComponent,
    WattEmptyStateComponent,
    WattPaginatorComponent,
    DhEmDashFallbackPipe,
  ],
  selector: 'dh-wholesale-table',
  templateUrl: './dh-wholesale-table.component.html',
  styleUrls: ['./dh-wholesale-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleTableComponent {
  @Input() selectedBatch?: Batch;

  @Input() set data(batches: Batch[]) {
    this._data.data = batches;
  }

  @Input()
  set filter(value: string) {
    this._data.filter = value;
  }

  @Output() selectedRow: EventEmitter<Batch> = new EventEmitter();

  _data: wholesaleTableData = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<Batch> = {
    startedBy: { accessor: null },
    periodFrom: { accessor: (batch) => batch.period?.start },
    periodTo: { accessor: (batch) => batch.period?.end },
    executionTime: { accessor: 'executionTimeStart' },
    processType: { accessor: 'processType' },
    status: { accessor: 'executionState' },
  };

  translateHeader = (key: string) => translate(`wholesale.searchBatch.columns.${key}`);
}
