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
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';
import { TranslocoModule } from '@ngneat/transloco';

import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    MatSortModule,
    TranslocoModule,
    WattEmptyStateModule,
    DhSharedUiPaginatorComponent,
    WattCardModule,
  ],
  selector: 'dh-wholesale-grid-areas',
  templateUrl: './dh-wholesale-grid-areas.component.html',
  styleUrls: ['./dh-wholesale-grid-areas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleGridAreasComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;

  @Input() set data(gridAreas: GridAreaDto[]) {
    this._data = new WattTableDataSource(gridAreas);
    this._data.paginator = this.paginator?.instance;
  }

  @Output() selected = new EventEmitter<GridAreaDto>();

  _data: WattTableDataSource<GridAreaDto> = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<GridAreaDto> = {
    gridAreaCode: { accessor: 'code' },
    name: { accessor: 'name', cell: (row: GridAreaDto) => row.name ?? '—' },
  };

  ngAfterViewInit() {
    this._data.paginator = this.paginator?.instance;
  }
}
