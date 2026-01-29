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
//#endregione';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import {
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';

import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableCellDirective,
} from '@energinet/watt/table';

import { WattIconComponent } from '@energinet/watt/icon';
import { WattButtonComponent } from '@energinet/watt/button';
import {
  WattDataActionsComponent,
  WattDataFiltersComponent,
  WattDataTableComponent,
} from '@energinet/watt/data';

import { DhChargesStatus } from '@energinet-datahub/dh/charges/ui-shared';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetChargesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ChargesQueryInput } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { Charge } from '../types';
import { DhChargesFilters } from './charges-filters';

@Component({
  selector: 'dh-charges',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterOutlet,
    TranslocoDirective,
    TranslocoPipe,
    VaterStackComponent,
    VaterUtilityDirective,
    WattButtonComponent,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WattIconComponent,
    WattTableCellDirective,
    WattTableComponent,
    DhChargesStatus,
    DhChargesFilters,
    DhPermissionRequiredDirective,
    DhChargesStatus,
    WattDataActionsComponent,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      *transloco="let t; prefix: 'charges.charges.table'"
      [enableCount]="false"
      vater
      inset="ml"
      [error]="dataSource.error"
      [ready]="dataSource.called"
    >
      <watt-data-filters>
        <vater-stack wrap direction="row" gap="m">
          <dh-charges-filters (filterChange)="fetch($event)" />
        </vater-stack>
      </watt-data-filters>

      <watt-data-actions>
        <watt-button
          *dhPermissionRequired="['charges:manage']"
          variant="secondary"
          routerLink="create"
        >
          <watt-icon name="plus" />
          {{ t('createButton') }}
        </watt-button>
      </watt-data-actions>

      <watt-table
        *transloco="let resolveHeader; prefix: 'charges.charges.table.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [resolveHeader]="resolveHeader"
        sortBy="type"
        sortDirection="asc"
        [activeRow]="selection()"
        [loading]="dataSource.loading"
        (rowClick)="navigation.navigate('id', $event.id, 'prices', $event.resolution)"
      >
        <ng-container *wattTableCell="columns.type; let element">
          {{ 'charges.chargeTypes.' + element.type | transloco }}
        </ng-container>
        <ng-container *wattTableCell="columns.status; let element">
          <dh-charges-status [status]="element.status" />
        </ng-container>
        <ng-container *wattTableCell="columns.resolution; let element">
          {{ 'charges.resolutions.' + element.resolution | transloco }}
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export class DhCharges {
  protected readonly navigation = inject(DhNavigationService);

  dataSource = new GetChargesDataSource();

  columns: WattTableColumnDef<Charge> = {
    type: { accessor: 'type' },
    code: { accessor: 'code' },
    name: { accessor: 'name' },
    owner: { accessor: (charge) => charge.owner?.displayName, sort: false },
    resolution: { accessor: 'resolution' },
    status: { accessor: 'status' },
  };

  fetch = (query: ChargesQueryInput) => this.dataSource.refetch({ query });

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };
}
