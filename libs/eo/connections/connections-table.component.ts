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
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { EoConnection } from './connections.service';
import { NgIf } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WATT_TABLE, WattPaginatorComponent, WattEmptyStateComponent, NgIf],
  standalone: true,
  selector: 'eo-connections-table',
  styles: [
    `
      watt-empty-state {
        padding: var(--watt-space-l);
      }

      watt-paginator {
        display: block;
        margin: 0 -24px -24px -24px;
      }
    `,
  ],
  template: `
    <watt-table [loading]="loading" [columns]="columns" [dataSource]="dataSource"></watt-table>

    <watt-empty-state
      *ngIf="loading === false && dataSource.data.length === 0 && !hasError"
      icon="custom-power"
      title="No connections found"
      message="You do not have any connections."
    ></watt-empty-state>

    <watt-empty-state
      *ngIf="loading === false && hasError"
      icon="custom-power"
      title="Oops! Something went wrong."
      message="Please try reloading the page.."
    ></watt-empty-state>

    <watt-paginator [for]="dataSource" />
  `,
})
export class EoConnectionsTableComponent {
  dataSource: WattTableDataSource<EoConnection> = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<EoConnection> = {
    id: { accessor: 'id', header: 'Company Id' },
    name: { accessor: 'name' },
  };

  @Input() loading = false;
  @Input() hasError = false;

  @Input()
  set connections(data: EoConnection[] | null) {
    this.dataSource.data = data || [];
  }

  @Input()
  set filter(value: string) {
    this.dataSource.filter = value;
  }
}
