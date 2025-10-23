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
import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import {
  WattTableComponent,
  WattTableColumnDef,
  WattTableCellDirective,
} from '@energinet-datahub/watt/table';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';

import {
  ChargeStatus,
  SortEnumType,
  GetChargesQueryInput,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetChargesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { Charge } from '../types';
import { DhChargeStatusComponent } from './status.component';
import { DhChargesFiltersComponent } from './filters.component';

@Component({
  selector: 'dh-charges',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,
    WattTableComponent,
    WattTableCellDirective,
    WattDataTableComponent,
    WattDataFiltersComponent,
    VaterUtilityDirective,
    DhChargeStatusComponent,
    DhChargesFiltersComponent,
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

      <watt-table
        *transloco="let resolveHeader; prefix: 'charges.charges.table.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="navigation.navigate('id', $event.id)"
      >
        <ng-container *wattTableCell="columns.type; let element">
          {{ 'charges.charges.chargeTypes.' + element.chargeType | transloco }}
        </ng-container>
        <ng-container *wattTableCell="columns.id; let element">
          {{ element.id }}
        </ng-container>
        <ng-container *wattTableCell="columns.name; let element">
          {{ element.chargeName }}
        </ng-container>
        <ng-container *wattTableCell="columns.owner; let element">
          {{ element.chargeOwner }}
        </ng-container>
        <ng-container *wattTableCell="columns.status; let element">
          <dh-charge-status [status]="element.status" />
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export class DhChargesComponent {
  protected readonly navigation = inject(DhNavigationService);

  dataSource = new GetChargesDataSource({
    variables: {
      order: {
        type: SortEnumType.Desc,
      },
    },
  });

  columns: WattTableColumnDef<Charge> = {
    type: { accessor: 'chargeType' },
    id: { accessor: 'id' },
    name: { accessor: 'chargeName' },
    owner: { accessor: 'chargeOwner' },
    status: { accessor: 'status' },
  };

  filter: GetChargesQueryInput = {
    statuses: [ChargeStatus.Current, ChargeStatus.MissingPriceSeries],
  };

  fetch = (query: GetChargesQueryInput) => this.dataSource.refetch({ query });

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };
}
