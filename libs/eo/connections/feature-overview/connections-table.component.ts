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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { NgIf } from '@angular/common';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { EoConnectionWithName } from '../data-access-api/connections.service';
import { EoRemoveConnectionComponent } from '../feature-remove-connection';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EoRemoveConnectionComponent,
    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,
    NgIf,
  ],
  standalone: true,
  selector: 'eo-connections-table',
  styles: [
    `
      eo-connections-table {
        watt-empty-state {
          padding: var(--watt-space-l);
        }

        watt-paginator {
          display: block;
          margin: 0 -24px -24px -24px;
        }

        watt-table table {
          --watt-table-grid-template-columns: auto auto 60px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <watt-table #table [loading]="loading" [columns]="columns" [dataSource]="dataSource">
      <eo-remove-connection
        *wattTableCell="table.columns['actions']; let element"
        [connection]="element"
        (connectionRemoved)="connectionRemoved.emit($event)"
      ></eo-remove-connection>
    </watt-table>

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
  dataSource: WattTableDataSource<EoConnectionWithName> = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<EoConnectionWithName> = {
    companyTin: { accessor: 'companyTin', header: 'Company Tin' },
    name: {
      accessor: (x) => x.companyName,
    },
    actions: {
      accessor: () => '',
      header: ' ',
    },
  };

  @Input() loading = false;
  @Input() hasError = false;

  @Input()
  set connections(data: EoConnectionWithName[] | null) {
    this.dataSource.data = data || [];
  }

  @Input()
  set filter(value: string) {
    this.dataSource.filter = value;
  }

  @Output() connectionRemoved = new EventEmitter<EoConnectionWithName>();
}
