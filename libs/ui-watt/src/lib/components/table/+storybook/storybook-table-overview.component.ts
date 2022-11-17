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
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WattIconModule } from '../../../foundations/icon/icon.module';
import { WattTableDataSource } from '../watt-table-data-source';
import { WATT_TABLE } from '../watt-table.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const periodicElements: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    WattIconModule,
    MatSortModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
  ],
  selector: 'watt-storybook-table-overview',
  templateUrl: 'storybook-table-overview.component.html',
  styles: [
    `
      :host {
        display: grid;
        height: calc(100vh - 2rem);
        grid-template-rows: min-content minmax(10rem, min-content);
      }
    `,
  ],
})
export class StorybookTableOverviewComponent implements AfterViewInit {
  @Input() selectable = false;
  @Input() suppressRowHoverHighlight = false;

  // Avoid using MatPaginator directly, instead prefer app specific
  // implementations (for now) such as DhSharedUiPaginatorComponent.
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  activeRow?: number;
  dataSource = new WattTableDataSource(periodicElements);
  columns = {
    position: { header: 'Position', size: 'min-content' },
    name: { header: 'Name' },
    symbol: { header: 'Symbol', sort: false },
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(event: PeriodicElement) {
    this.activeRow = event.position;
  }

  isActiveRow = (row: PeriodicElement) => {
    return row.position === this.activeRow;
  };
}
