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
  NgModule,
  ViewChild,
} from '@angular/core';
import {
  MatSort,
  MatSortable,
  MatSortModule,
  Sort,
} from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { RouterModule } from '@angular/router';
import { DhProcess } from '@energinet-datahub/dh/metering-point/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

import { WattIconModule } from '@energinet-datahub/watt/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { DhProcessesDetailItemScam } from '../processes-detail-item/dh-processes-detail-item.component';
import { DhTableRow } from './dh-table-row';
import {
  compareSortValues,
  getRowHeight,
  getRowToExpand,
  wrapInTableRow,
} from './dh-table-util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-processes-table',
  templateUrl: './dh-processes-table.component.html',
  styleUrls: ['./dh-processes-table.component.scss'],
})
export class DhProcessesTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'rowExpandControl',
    'name',
    'createdDate',
    'effectiveDate',
    'status',
    'hasDetailsErrors',
  ];
  sortedData: DhTableRow<DhProcess>[] = [];

  @Input() processes: DhProcess[] = [];

  processRows: DhTableRow<DhProcess>[] = [];

  @ViewChild(MatSort) matSort?: MatSort;

  ngAfterViewInit(): void {
    if (this.processRows.length === 0) {
      this.processRows = wrapInTableRow<DhProcess>(this.processes);
    }
    if (this.processes != undefined) {
      this.setDefaultSorting();
    }
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.processRows;
      this.setDefaultSorting();
      return;
    }

    this.sortedData = this.processRows.slice().sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compareSortValues(a.data.name, b.data.name, isAsc);
        case 'createdDate':
          return compareSortValues(
            a.data.createdDate,
            b.data.createdDate,
            isAsc
          );
        case 'effectiveDate':
          return compareSortValues(
            a.data.effectiveDate ?? '',
            b.data.effectiveDate ?? '',
            isAsc
          );
        case 'status':
          return compareSortValues(a.data.status, b.data.status, isAsc);
        default:
          return 0;
      }
    });
  }

  toggleRow(event: Event, row: DhTableRow<DhProcess>) {
    if (!row.expanded && event.target) {
      const rowToExpand = getRowToExpand(event.target as HTMLElement);
      if (!rowToExpand) return;

      this.expandRow(rowToExpand, row);
    } else {
      this.collapseRow(row);
    }
  }

  expandRow(rowToExpand: HTMLElement, row: DhTableRow<DhProcess>) {
    row.maxHeight = getRowHeight(rowToExpand);
    row.expanded = true;
  }

  collapseRow(row: DhTableRow<DhProcess>) {
    row.maxHeight = 0;
    row.expanded = false;
  }

  private setDefaultSorting() {
    if (this.matSort === undefined) return;

    const sortable = this.matSort.sortables.get('createdDate') as MatSortable;
    sortable.start = 'desc';
    this.matSort.sort(sortable);
  }
}

@NgModule({
  declarations: [DhProcessesTableComponent],
  imports: [
    MatTableModule,
    TranslocoModule,
    WattIconModule,
    MatSortModule,
    CommonModule,
    RouterModule,
    DhSharedUiDateTimeModule,
    DhProcessesDetailItemScam,
  ],
  exports: [DhProcessesTableComponent],
})
export class DhProcessesTableScam {}
