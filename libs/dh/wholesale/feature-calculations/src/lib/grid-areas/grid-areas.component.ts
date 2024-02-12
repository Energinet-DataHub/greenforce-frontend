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
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TranslocoModule } from '@ngneat/transloco';

import { WattTableDataSource, WattTableColumnDef, WATT_TABLE, WattPaginatorComponent } from '@energinet-datahub/watt/table';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { CalculationGridArea } from '@energinet-datahub/dh/wholesale/domain';

@Component({
  standalone: true,
  imports: [
    NgIf,
    WATT_TABLE,
    MatSortModule,
    TranslocoModule,
    WattEmptyStateComponent,
    WattPaginatorComponent,
    WATT_CARD,
  ],
  selector: 'dh-calculations-grid-areas',
  templateUrl: './grid-areas.component.html',
  styleUrls: ['./grid-areas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhCalculationsGridAreasComponent {
  @ViewChild(MatSort) sort!: MatSort;

  @Input()
  set data(gridAreas: CalculationGridArea[]) {
    this._data = new WattTableDataSource(gridAreas);
  }

  @Input() disabled = false;

  _data: WattTableDataSource<CalculationGridArea> = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<CalculationGridArea> = {
    gridAreaCode: { accessor: 'code' },
    name: {
      accessor: 'name',
      cell: (row: CalculationGridArea) => row.name ?? '—',
    },
  };
}
