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
import { Component, computed, input, signal } from '@angular/core';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_TABLE, WattTableColumnDef } from '../watt-table.component';
import { WattTableDataSource } from '../watt-table-data-source';
import { StorybookPeriodicElements } from './storybook-periodic-elements';
import { PeriodicElementsByType } from './storybook-periodic-elements-data';

@Component({
  selector: 'storybook-periodic-elements-by-type',
  imports: [
    StorybookPeriodicElements,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattButtonComponent,
    WATT_TABLE,
  ],
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <vater-flex fill="vertical" gap="m">
      <vater-stack fill="horizontal" justify="end" direction="row" gap="m">
        <watt-button variant="secondary" (click)="expand()">Expand all</watt-button>
        <watt-button variant="secondary" (click)="collapse()">Collapse all</watt-button>
      </vater-stack>
      <watt-table
        #table
        vater
        fill="vertical"
        description="Atomic Elements"
        sortBy="position"
        sortDirection="asc"
        variant="zebra"
        [dataSource]="dataSource()"
        [columns]="columns"
        [expanded]="expanded()"
        trackBy="type"
      >
        <ng-container *wattTableCell="table.columns.type; let category">
          {{ category.title }}
        </ng-container>
        <ng-container *wattTableCell="table.columns.elements; let category">
          <storybook-periodic-elements [data]="category.elements" [hideColumnHeaders]="true" />
        </ng-container>
      </watt-table>
    </vater-flex>
  `,
})
export class StorybookPeriodicElementsByType {
  expanded = signal<PeriodicElementsByType[]>([]);
  data = input.required<PeriodicElementsByType[]>();
  dataSource = computed(() => new WattTableDataSource(this.data()));
  expand = () => this.expanded.set(this.dataSource().data);
  collapse = () => this.expanded.set([]);
  columns = {
    type: { accessor: (row) => row.title },
    elements: { accessor: (row) => row.elements, expandable: true },
    id: { accessor: (row) => row.type },
  } satisfies WattTableColumnDef<PeriodicElementsByType>;
}
