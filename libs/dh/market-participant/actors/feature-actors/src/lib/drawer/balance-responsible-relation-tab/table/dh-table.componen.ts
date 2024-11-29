import { Component, effect, input } from '@angular/core';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import {
  DhBalanceResponsibleRelation,
  DhBalanceResponsibleRelations,
} from '../dh-balance-responsible-relation';
import { DhBalanceResponsibleRelationStatusComponent } from '../status/dh-balance-responsible-relation-status.component';

@Component({
  selector: 'dh-balance-responsible-relations-table',
  standalone: true,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-table
      [dataSource]="tableDataSource"
      [columns]="columns"
      [sortClear]="false"
      sortBy="gridArea"
      sortDirection="asc"
      [suppressRowHoverHighlight]="true"
      [hideColumnHeaders]="true"
    >
      <ng-container *wattTableCell="columns['period']; let entry">
        {{ entry.validPeriod.start | wattDate: 'short' }}
        @if (entry.validPeriod.end) {
          -
          {{ entry.validPeriod.end | wattDate: 'short' }}
        }
      </ng-container>

      <ng-container *wattTableCell="columns['gridArea']; let entry">
        {{ entry.gridArea?.displayName }}
      </ng-container>

      <ng-container *wattTableCell="columns['status']; let entry">
        <dh-balance-responsible-relation-status [status]="entry.status" />
      </ng-container>
    </watt-table>
  `,
  imports: [WATT_TABLE, WattDatePipe, DhBalanceResponsibleRelationStatusComponent],
})
export class DhBalanceResponsibleRelationsTableComponent {
  tableDataSource = new WattTableDataSource<DhBalanceResponsibleRelation>([]);

  columns: WattTableColumnDef<DhBalanceResponsibleRelation> = {
    gridArea: { accessor: 'gridArea' },
    period: { accessor: null, size: '1fr' },
    status: { accessor: null, size: '2fr' },
  };

  data = input.required<DhBalanceResponsibleRelations>();

  constructor() {
    effect(() => {
      this.tableDataSource.data = this.data();
    });
  }
}
