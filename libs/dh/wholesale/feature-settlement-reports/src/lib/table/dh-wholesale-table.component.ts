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
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';

import { PushModule } from '@rx-angular/template/push';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { settlementReportsProcess } from '@energinet-datahub/dh/wholesale/domain';

type settlementReportsTableData = WattTableDataSource<settlementReportsProcess>;

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
    WattPaginatorComponent,
  ],
  selector: 'dh-wholesale-table',
  templateUrl: './dh-wholesale-table.component.html',
  styleUrls: ['./dh-wholesale-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleTableComponent {
  private store = inject(DhWholesaleBatchDataAccessApiStore);

  selectedBatch$ = this.store.selectedBatch$;

  @Input() set data(processes: settlementReportsProcess[]) {
    this._data = new WattTableDataSource(processes);
  }

  @Output() selectedRow: EventEmitter<settlementReportsProcess> = new EventEmitter();
  @Output() download: EventEmitter<settlementReportsProcess> = new EventEmitter();

  _data: settlementReportsTableData = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<settlementReportsProcess> = {
    processType: { accessor: 'processType' },
    gridAreaName: { accessor: 'gridAreaName' },
    periodStart: { accessor: (row) => row.period?.start },
    periodEnd: { accessor: (row) => row.period?.end },
    executionTimeStart: { accessor: 'executionTimeStart' },
  };

  translateHeader = (key: string) => translate(`wholesale.settlementReports.table.${key}`);
}
