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
import { Component, computed, input, model } from '@angular/core';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WATT_TABLE, WattTableColumnDef } from '../watt-table.component';
import { WattTableDataSource } from '../watt-table-data-source';
import { PeriodicElement } from './storybook-periodic-elements-data';

@Component({
  selector: 'storybook-periodic-elements',
  imports: [VaterStackComponent, WattButtonComponent, WattIconComponent, WATT_TABLE],
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <watt-table
      #table
      description="Atomic Elements"
      sortBy="position"
      sortDirection="asc"
      [dataSource]="dataSource()"
      [columns]="columns"
      [selectable]="selectable()"
      [initialSelection]="initialSelection()"
      [suppressRowHoverHighlight]="suppressRowHoverHighlight()"
      [hideColumnHeaders]="hideColumnHeaders()"
      [activeRow]="activeRow()"
      (rowClick)="activeRow.set($event)"
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
      @if (selectable()) {
        <ng-container *wattTableToolbar="let selection">
          <vater-stack direction="row" gap="xl">
            <span>{{ selection.length }} selected rows</span>
            <vater-stack direction="row">
              <watt-button icon="download">Download</watt-button>
              <watt-button icon="upload">Upload</watt-button>
            </vater-stack>
          </vater-stack>
        </ng-container>
      }
    </watt-table>
  `,
})
export class StorybookPeriodicElements {
  activeRow = model<PeriodicElement>();
  selectable = input(false);
  suppressRowHoverHighlight = input(false);
  hideColumnHeaders = input(false);
  initialSelection = input<PeriodicElement[]>([]);
  data = input.required<PeriodicElement[]>();
  dataSource = computed(() => new WattTableDataSource(this.data()));
  columns = {
    position: { accessor: (row) => row.position, size: 'min-content' },
    name: { accessor: (row) => row.name },
    symbol: { accessor: (row) => row.symbol, sort: false },
  } satisfies WattTableColumnDef<PeriodicElement>;
}
