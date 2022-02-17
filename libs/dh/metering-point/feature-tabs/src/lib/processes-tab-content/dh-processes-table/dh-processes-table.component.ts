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
  Component,
  Input,
  NgModule,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MatSort,
  MatSortable,
  MatSortModule,
  Sort,
} from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';

import {
  WattIconModule,
  WattIconSize,
  WattEmptyStateModule,
} from '@energinet-datahub/watt';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhMeteringPointStatusBadgeScam } from '@energinet-datahub/dh/metering-point/ui-status-badge';
import {
  MeteringPointSimpleCimDto,
  Process,
} from '@energinet-datahub/dh/shared/data-access-api';
import { DhDatePipe } from '../../../../../../shared/ui-date-time/src/lib/dh-date.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-processes-table',
  templateUrl: './dh-processes-table.component.html',
  styleUrls: ['./dh-processes-table.scss'],
})
export class DhProcessesTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'createdDate',
    'effectiveDate',
    'status',
    'hasErrors',
  ];
  iconSize = WattIconSize;
  sortedData: Process[] = [];
  @Input()
  processes?: Process[];

  @ViewChild(MatSort) matSort?: MatSort;

  ngAfterViewInit(): void {
    if (this.processes != undefined) {
      this.setDefaultSorting();
    }
  }

  sortData(sort: Sort) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = this.processes!.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.setDefaultSorting();
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'createdDate':
          return this.compare(a.createdDate, b.createdDate, isAsc);
        case 'effectiveDate':
          return this.compare(
            a.effectiveDate ?? '',
            b.effectiveDate ?? '',
            isAsc
          );
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }

  setDefaultSorting() {
    if (this.matSort === undefined) return;

    const sortable = this.matSort.sortables.get('createdDate') as MatSortable;
    sortable.start = 'desc';
    this.matSort.sort(sortable);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

@NgModule({
  declarations: [DhProcessesTableComponent],
  imports: [
    MatTableModule,
    TranslocoModule,
    DhMeteringPointStatusBadgeScam,
    WattIconModule,
    MatSortModule,
    CommonModule,
    WattEmptyStateModule,
    RouterModule,
    DhSharedUiDateTimeModule,
  ],
  exports: [DhProcessesTableComponent],
})
export class DhProcessTableScam {}
