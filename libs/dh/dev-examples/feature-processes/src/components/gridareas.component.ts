//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattTableDataSource, WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';

import { DhProcessCalculationGridArea } from '../types';

@Component({
  imports: [MatSortModule, TranslocoDirective, WATT_TABLE, WattDataTableComponent, WATT_CARD],
  selector: 'dh-calculation-details-grid-areas',
  template: `
    <watt-data-table
      *transloco="let t; read: 'devExamples.processes.details'"
      variant="solid"
      [enableSearch]="false"
      [enablePaginator]="false"
    >
      <h4>{{ t('gridAreas') }}</h4>

      <watt-table
        [dataSource]="datasource"
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
export class DhCalculationsDetailsGridAreasComponent {
  gridAreas = input.required<DhProcessCalculationGridArea[]>();

  datasource: WattTableDataSource<DhProcessCalculationGridArea> = new WattTableDataSource(
    undefined
  );

  columns: WattTableColumnDef<DhProcessCalculationGridArea> = {
    displayName: { accessor: 'displayName' },
  };

  constructor() {
    effect(() => {
      this.datasource.data = this.gridAreas();
    });
  }
}
