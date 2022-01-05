/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { MeteringPointSimpleCimDto } from '@energinet-datahub/dh/shared/data-access-api';

import { DhMeteringPointStatusBadgeScam } from '../status-badge/dh-metering-point-status-badge.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-child-metering-point-tab-content',
  templateUrl: './dh-child-metering-point-tab-content.component.html',
  styleUrls: ['./dh-child-metering-point-tab-content.component.scss'],
})
export class DhChildMeteringPointTabContentComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'childMeteringPoint',
    'effectivePeriod',
    'status',
  ];
  iconSize = WattIconSize;
  sortedData: Array<MeteringPointSimpleCimDto> = [];
  @Input()
  childMeteringPoints: Array<MeteringPointSimpleCimDto> | null | undefined;

  @ViewChild(MatSort) matSort?: MatSort;

  ngAfterViewInit(): void {
    if (this.childMeteringPoints != undefined) {
      this.setDefaultSorting();
    }
  }

  sortData(sort: Sort) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = this.childMeteringPoints!.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.setDefaultSorting();
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'childMeteringPoint':
          return this.compare(a.gsrnNumber, b.gsrnNumber, isAsc);
        case 'effectivePeriod':
          return this.compare(a.effectiveDate, b.effectiveDate, isAsc);
        case 'status':
          return this.compare(a.connectionState, b.connectionState, isAsc);
        default:
          return 0;
      }
    });
  }

  setDefaultSorting() {
    this.matSort?.sort(
      this.matSort.sortables.get('childMeteringPoint') as MatSortable
    );
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

@NgModule({
  declarations: [DhChildMeteringPointTabContentComponent],
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
  exports: [DhChildMeteringPointTabContentComponent],
})
export class DhChildMeteringPointTabContentScam {}
