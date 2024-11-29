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
