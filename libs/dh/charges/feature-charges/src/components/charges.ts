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
  VaterUtilityDirective,
} from '@energinet/watt/vater';

import {
  WattTableComponent,
  WattTableColumnDef,
  WattTableCellDirective,
} from '@energinet/watt/table';

import { WattIconComponent } from '@energinet/watt/icon';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDataActionsComponent, WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { ChargeStatus, GetChargesQueryInput } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetChargesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { Charge } from '../types';
import { DhChargeStatus } from './status';
import { DhChargesFilters } from './filters';

@Component({
  selector: 'dh-charges',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,
    VaterUtilityDirective,
    WattButtonComponent,
    WattIconComponent,
    WattTableComponent,
    WattTableCellDirective,
    WattDataTableComponent,
    WattDataFiltersComponent,
    DhChargeStatus,
    DhChargesFilters,
    WattDataActionsComponent,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      [enableCount]="false"
      vater
      inset="ml"
      [error]="dataSource.error"
      [ready]="dataSource.called"
      *transloco="let t; prefix: 'charges.charges.table'"
    >
      <watt-data-filters>
        <dh-charges-filters [filter]="filter" (filterChange)="fetch($event)" />
      </watt-data-filters>

      <watt-data-actions>
        <watt-button variant="secondary" routerLink="create">
          <watt-icon name="plus" />
          {{ t('createButton') }}
        </watt-button>
      </watt-data-actions>

      <watt-table
        *transloco="let resolveHeader; prefix: 'charges.charges.table.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        [loading]="dataSource.loading"
        (rowClick)="navigation.navigate('id', $event.id, 'prices', $event.resolution)"
      >
        <ng-container *wattTableCell="columns.type; let element">
          {{ 'charges.chargeTypes.' + element.type | transloco }}
        </ng-container>
        <ng-container *wattTableCell="columns.status; let element">
          <dh-charge-status [status]="element.status" />
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
    type: { accessor: 'type', sort: false },
    code: { accessor: 'code', sort: false },
    name: { accessor: (charge) => charge.currentPeriod?.name, sort: false },
    owner: { accessor: (charge) => charge.owner?.displayName, sort: false },
    status: { accessor: 'status', sort: false },
  };

  filter: GetChargesQueryInput = {
    statuses: [ChargeStatus.Current, ChargeStatus.MissingPriceSeries],
  };

  fetch = (query: GetChargesQueryInput) => this.dataSource.refetch({ query });

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };
}
