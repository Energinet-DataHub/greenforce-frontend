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
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { DhProcess } from '@energinet-datahub/dh/metering-point/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

import {
  WattEmptyStateModule,
  WattIconModule,
  WattIconSize,
} from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import { DhProcessesDetailItemScam } from '../dh-processes-detail-item/dh-processes-detail-item.component';
import { DhProcessesTableRow } from './dh-processes-table-row';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-processes-table',
  templateUrl: './dh-processes-table.component.html',
  styleUrls: ['./dh-processes-table.component.scss'],
})
export class DhProcessesTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'tableExpandControl',
    'name',
    'createdDate',
    'effectiveDate',
    'status',
    'hasDetailsErrors',
  ];
  iconSize = WattIconSize;
  sortedData: DhProcessesTableRow[] = [];
  @Input()
  processes: DhProcess[] = [];

  @ViewChild(MatSort) matSort?: MatSort;

  private static wrapInTableRow(data: DhProcess[]): DhProcessesTableRow[] {
    return data.map((process) => ({
      data: process,
      expanded: false,
      height: 0,
    }));
  }

  private setDefaultSorting() {
    if (this.matSort === undefined) return;

    const sortable = this.matSort.sortables.get('createdDate') as MatSortable;
    sortable.start = 'desc';
    this.matSort.sort(sortable);
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngAfterViewInit(): void {
    if (this.processes != undefined) {
      this.setDefaultSorting();
    }
  }

  sortData(sort: Sort) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = DhProcessesTableComponent.wrapInTableRow(
      this.processes?.slice()
    );
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.setDefaultSorting();
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.data.name, b.data.name, isAsc);
        case 'createdDate':
          return this.compare(a.data.createdDate, b.data.createdDate, isAsc);
        case 'effectiveDate':
          return this.compare(
            a.data.effectiveDate ?? '',
            b.data.effectiveDate ?? '',
            isAsc
          );
        case 'status':
          return this.compare(a.data.status, b.data.status, isAsc);
        default:
          return 0;
      }
    });
  }

  expandRow(event: Event, row: DhProcessesTableRow) {
    console.log(event, row);
    const rowToExpand = (event.target as HTMLElement).closest(
      'mat-row'
    ).nextElementSibling;
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
    WattEmptyStateModule,
    RouterModule,
    DhSharedUiDateTimeModule,
    DhProcessesDetailItemScam,
  ],
  exports: [DhProcessesTableComponent],
})
export class DhProcessesTableScam {}
