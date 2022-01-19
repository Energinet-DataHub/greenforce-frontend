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
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';

import { WattIconSize } from '../../../foundations/icon';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export const periodicElements: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-table-overview',
  templateUrl: 'storybook-table-overview.component.html',
})
export class StorybookTableOverviewComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'symbol'];
  sortedData: PeriodicElement[] = [];
  iconSize = WattIconSize;

  @ViewChild(MatSort) matSort?: MatSort;

  ngAfterViewInit(): void {
    this.setDefaultSorting();
  }

  sortData(sort: Sort) {
    // Shallow copy of original array
    const data = [...periodicElements];

    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.setDefaultSorting();
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'position':
          return this.compare(a.position, b.position, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'symbol':
          return this.compare(a.symbol, b.symbol, isAsc);
        default:
          return 0;
      }
    });
  }

  setDefaultSorting() {
    this.matSort?.sort(this.matSort.sortables.get('position') as MatSortable);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
