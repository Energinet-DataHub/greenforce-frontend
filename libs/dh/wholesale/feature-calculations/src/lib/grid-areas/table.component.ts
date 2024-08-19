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
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattTableDataSource, WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';

import { CalculationGridArea } from '@energinet-datahub/dh/wholesale/domain';

@Component({
  standalone: true,
  imports: [MatSortModule, TranslocoDirective, WATT_TABLE, WattDataTableComponent, WATT_CARD],
  selector: 'dh-calculations-grid-areas-table',
  template: `
    <watt-data-table
      *transloco="let t; read: 'wholesale.calculations.details'"
      variant="solid"
      [enableSearch]="false"
      [enablePaginator]="false"
    >
      <h4>{{ t('gridAreas') }}</h4>
      <!-- Table -->
      <watt-table
        [dataSource]="_data"
        [columns]="columns"
        [suppressRowHoverHighlight]="true"
        [hideColumnHeaders]="true"
        sortBy="displayName"
        sortDirection="asc"
      />
    </watt-data-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhCalculationsGridAreasTableComponent {
  @ViewChild(MatSort) sort!: MatSort;

  @Input()
  set data(gridAreas: CalculationGridArea[]) {
    this._data = new WattTableDataSource(gridAreas);
  }

  @Input() disabled = false;

  _data: WattTableDataSource<CalculationGridArea> = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<CalculationGridArea> = {
    displayName: { accessor: 'displayName' },
  };
}
