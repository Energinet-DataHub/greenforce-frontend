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
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export const periodicElements: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen Hydrogen Hydrogen Hydrogen Hydrogen Hydrogen Hydrogen Hydrogen Hydrogen ',
    weight: 1.0079,
    symbol: 'H',
  },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  encapsulation: ViewEncapsulation.None,
  selector: 'storybook-table-overview',
  templateUrl: 'storybook-table-overview.component.html',
  styleUrls: ['style.scss'],
})
export class StorybookTableOverviewComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'symbol'];
  sortedData = new MatTableDataSource(periodicElements);

  @ViewChild(MatSort) matSort?: MatSort;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.sortedData.sort = this.matSort ?? null;
  }

  updateStyle() {
    const tbody = this.elRef.nativeElement.querySelector('tbody');
    const thead = this.elRef.nativeElement.querySelector('.mat-header-row');

    const gridTemplateColumns =
      window.getComputedStyle(tbody).gridTemplateColumns;

    thead.style.gridTemplateColumns = gridTemplateColumns;
  }

  sortData(sort: Sort) {
    if (sort.direction === '') {
      this.setDefaultSorting();
    }
  }

  setDefaultSorting() {
    this.matSort?.sort(this.matSort.sortables.get('position') as MatSortable);
  }
}
