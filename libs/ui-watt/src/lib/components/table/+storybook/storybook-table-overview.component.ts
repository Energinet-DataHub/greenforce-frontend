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
import { Component, Input } from '@angular/core';
import { WattTableDataSource } from '../watt-table-data-source';

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
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-table-overview',
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
export class StorybookTableOverviewComponent {
  @Input() selectable = false;
  @Input() suppressRowHoverHighlight = false;

  dataSource = new WattTableDataSource(periodicElements);
  columns = {
    position: { header: 'Position', size: 'min-content' },
    name: { header: 'Name' },
    symbol: { header: 'Symbol', sort: false },
  };

  activeRow?: number;

  onRowClick(event: PeriodicElement) {
    this.activeRow = event.position;
  }

  isActiveRow = (row: PeriodicElement) => {
    return row.position === this.activeRow;
  };
}
