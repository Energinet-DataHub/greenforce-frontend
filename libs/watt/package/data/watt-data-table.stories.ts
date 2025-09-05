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
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { WattDataTableComponent } from './watt-data-table.component';
import { WattButtonComponent } from '../button';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '../table';
import { WattIconComponent } from '../icon/icon.component';
import { VaterStackComponent, VaterUtilityDirective } from '../vater';
import { WattFilterChipComponent } from '../chip';
import { WattDataFiltersComponent } from './watt-data-filters.component';
import {
  PeriodicElement,
  periodicElements,
} from '../table/+storybook/storybook-periodic-elements-data';

const meta: Meta = {
  title: 'Components/Data Presentation',
  decorators: [
    moduleMetadata({
      imports: [
        VaterStackComponent,
        VaterUtilityDirective,
        WattButtonComponent,
        WattFilterChipComponent,
        WattIconComponent,
        WATT_TABLE,
        WattDataTableComponent,
        WattDataFiltersComponent,
      ],
    }),
  ],
};

export default meta;

export const DataTable: StoryObj<WattDataTableComponent> = {
  render: () => ({
    props: {
      dataSource: new WattTableDataSource(periodicElements),
      columns: {
        position: { accessor: (row) => row.position, size: 'min-content' },
        name: { accessor: (row) => row.name },
        symbol: { accessor: (row) => row.symbol, sort: false },
      } satisfies WattTableColumnDef<PeriodicElement>,
    },
    template: `
      <watt-data-table vater inset="m">
        <h3>Results</h3>
        <watt-button icon="plus" variant="secondary">Add Element</watt-button>
        <watt-data-filters>
          <vater-stack fill="vertical" gap="s" direction="row">
            <watt-filter-chip choice [selected]="true" name="classification">Any Classification</watt-filter-chip>
            <watt-filter-chip choice name="classification">Metals</watt-filter-chip>
            <watt-filter-chip choice name="classification">Non-Metals</watt-filter-chip>
            <watt-filter-chip choice name="classification">Metalloids</watt-filter-chip>
            <watt-filter-chip choice name="classification">Noble Gases</watt-filter-chip>
          </vater-stack>
        </watt-data-filters>
        <watt-table
          #table
          description="Atomic Elements"
          sortBy="position"
          sortDirection="asc"
          [dataSource]="dataSource"
          [columns]="columns"
        >
          <ng-container *wattTableCell="table.columns.name; let element">
            <div class="watt-text-s">
              {{ element.name }}
              <div class="watt-on-light--medium-emphasis">Weight: {{ element.weight }}</div>
            </div>
          </ng-container>
          <ng-container *wattTableCell="table.columns.symbol; let element">
            <div style="display: flex">
              <watt-icon name="date" size="xs" class="date-icon watt-space-inline-s" />
              <span class="watt-text-s">{{ element.symbol }}</span>
            </div>
          </ng-container>
        </watt-table>
      </watt-data-table>
    `,
  }),
};
