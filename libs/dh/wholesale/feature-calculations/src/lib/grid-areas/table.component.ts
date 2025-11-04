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
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet/watt/card';
import { WattDataTableComponent } from '@energinet/watt/data';
import { WattTableDataSource, WattTableColumnDef, WATT_TABLE } from '@energinet/watt/table';

import { CalculationGridArea } from '@energinet-datahub/dh/wholesale/domain';

@Component({
  imports: [TranslocoDirective, WATT_TABLE, WattDataTableComponent, WATT_CARD],
  selector: 'dh-calculations-grid-areas-table',
  template: `
    <watt-data-table
      *transloco="let t; prefix: 'wholesale.calculations.details'"
      variant="solid"
      [enableSearch]="false"
      [enablePaginator]="false"
      [autoSize]="true"
    >
      <h4>{{ t('gridAreas') }}</h4>
      <!-- Table -->
      <watt-table
        [dataSource]="dataSource"
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
  readonly data = input.required<CalculationGridArea[]>();
  readonly disabled = input(false);

  dataSource: WattTableDataSource<CalculationGridArea> = new WattTableDataSource(undefined);

  columns: WattTableColumnDef<CalculationGridArea> = {
    displayName: { accessor: 'displayName' },
  };

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
    });
  }
}
