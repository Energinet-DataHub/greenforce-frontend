//#region License
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
//#endregion
import { moduleMetadata, StoryFn } from '@storybook/angular';
import { MatSortModule } from '@angular/material/sort';

import { WattTableColumnDef, WATT_TABLE } from './watt-table.component';
import { WattTableDataSource } from './watt-table-data-source';
import { WattButtonComponent } from '../button';
import { WattIconComponent } from '../icon/icon.component';
import { VaterFlexComponent, VaterSpacerComponent, VaterStackComponent } from '../vater';

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

export default {
  title: 'Components/Table',
  decorators: [
    moduleMetadata({
      imports: [
        WATT_TABLE,
        VaterFlexComponent,
        VaterStackComponent,
        VaterSpacerComponent,
        WattButtonComponent,
        WattIconComponent,
        MatSortModule,
      ],
    }),
  ],
};

export const Table: StoryFn = (args) => {
  return {
    props: args,
    template: `
      <vater-flex inset="m">
        <watt-table
          #table
          description="Atomic Elements"
          sortBy="position"
          sortDirection="asc"
          [dataSource]="dataSource"
          [columns]="columns"
          [selectable]="selectable"
          [initialSelection]="initialSelection"
          [suppressRowHoverHighlight]="suppressRowHoverHighlight"
          [activeRow]="activeRow"
          (rowClick)="activeRow = $event"
        >
          <ng-container *wattTableCell="table.columns.name; let element">
            <div class="watt-text-s">
              {{ element.name }}
              <div class="watt-on-light--medium-emphasis">
                Weight: {{ element.weight }}
              </div>
            </div>
          </ng-container>
          <ng-container *wattTableCell="table.columns.symbol; let element">
            <div style="display: flex">
              <watt-icon
                name="date"
                size="xs"
                class="date-icon watt-space-inline-s"
              ></watt-icon>
              <span class="watt-text-s">{{ element.symbol }}</span>
            </div>
          </ng-container>
          <ng-container *wattTableToolbar="let selection">
            <vater-stack direction="row" gap="xl">
              <span>{{ selection.length }} selected rows</span>
              <vater-stack direction="row">
                <watt-button type="text" icon="download">
                  Download
                </watt-button>
                <watt-button type="text" icon="upload">
                  Upload
                </watt-button>
              </vater-stack>
            </vater-stack>
          </ng-container>
        </watt-table>
      </vater-flex>
    `,
  };
};

Table.args = {
  selectable: true,
  suppressRowHoverHighlight: false,
  columns: {
    position: { accessor: 'position', size: 'min-content' },
    name: { accessor: 'name' },
    symbol: { accessor: 'symbol', sort: false },
  } as WattTableColumnDef<PeriodicElement>,
  dataSource: new WattTableDataSource(periodicElements),
  initialSelection: [periodicElements[0], periodicElements[1]],
  activeRow: undefined,
};

Table.argTypes = {
  activeRow: { control: false },
  dataSource: { control: false },
};
