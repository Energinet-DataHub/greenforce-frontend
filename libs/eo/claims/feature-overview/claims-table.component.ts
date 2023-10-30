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
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { Claim } from '@energinet-datahub/eo/claims/data-access-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WATT_TABLE, WattPaginatorComponent, WattEmptyStateComponent, NgIf],
  standalone: true,
  selector: 'eo-claims-table',
  styles: [
    `
      eo-claims-table {
        watt-empty-state {
          padding: var(--watt-space-l);
        }

        watt-paginator {
          display: block;
          margin: 0 -24px -24px -24px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <watt-table #table [loading]="loading" [columns]="columns" [dataSource]="dataSource" />

    <watt-empty-state
      *ngIf="loading === false && dataSource.data.length === 0 && !hasError"
      icon="custom-power"
      title="No claims found"
      message="You do not have any claims."
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
export class EoClaimsTableComponent {
  dataSource: WattTableDataSource<Claim> = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<Claim> = {
    claimId: { accessor: (x) => x.claimId, header: 'Claim Id' },
    quantity: { accessor: (x) => x.quantity },
  };

  @Input() loading = false;
  @Input() hasError = false;

  @Input()
  set claims(data: Claim[] | null) {
    this.dataSource.data = data || [];
  }

  @Input()
  set filter(value: string) {
    this.dataSource.filter = value;
  }
}
