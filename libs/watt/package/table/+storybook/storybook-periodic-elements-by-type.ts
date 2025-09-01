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
import { Component, computed, input, linkedSignal } from '@angular/core';
import { WATT_TABLE, WattTableColumnDef } from '../watt-table.component';
import { WattTableDataSource } from '../watt-table-data-source';
import { StorybookPeriodicElements } from './storybook-periodic-elements';
import { PeriodicElementsByType } from './storybook-periodic-elements-data';

@Component({
  selector: 'storybook-periodic-elements-by-type',
  imports: [StorybookPeriodicElements, WATT_TABLE],
  styles: `
    :host {
      display: contents;
    }

    watt-table {
      height: 100%;
    }
  `,
  template: `
    <watt-table
      #table
      description="Atomic Elements"
      sortBy="position"
      sortDirection="asc"
      variant="zebra"
      [dataSource]="dataSource()"
      [columns]="columns"
    >
      <ng-container *wattTableCell="table.columns.type; let category">
        {{ category.title }}
      </ng-container>
      <ng-container *wattTableCell="table.columns.elements; let category">
        <storybook-periodic-elements [data]="category.elements" [hideColumnHeaders]="true" />
      </ng-container>
    </watt-table>
  `,
})
export class StorybookPeriodicElementsByType {
  data = input.required<PeriodicElementsByType[]>();
  dataSource = computed(() => new WattTableDataSource(this.data()));
  columns = {
    type: { accessor: (row) => row.title },
    elements: { accessor: (row) => row.elements, expandable: true },
    id: { accessor: (row) => row.type },
  } satisfies WattTableColumnDef<PeriodicElementsByType>;
}
