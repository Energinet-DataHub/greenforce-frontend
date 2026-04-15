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

import { VATER } from '@energinet/watt/vater';

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

import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';
import { GetChargeOverviewDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ChargeOverviewQueryInput } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { WattDatePipe } from '@energinet/watt/date';

import { ChargeOverviewItem } from '../types';
import { DhChargesFilters } from './charges-filters';

@Component({
  selector: 'dh-charges',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterOutlet,
    TranslocoDirective,
    TranslocoPipe,
    VATER,
    WattButtonComponent,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WattDatePipe,
    WattIconComponent,
    WattTableCellDirective,
    WattTableComponent,
    DhChargesFilters,
    DhPermissionRequiredDirective,
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
        <dh-charges-filters vater fragment (filterChange)="fetch($event)" />
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
        [activeRow]="selection()"
        [loading]="dataSource.loading"
        (rowClick)="navigation.navigate('id', $event.charge.id, 'prices', $event.charge.resolution)"
      >
        <ng-container *wattTableCell="columns.type; let element">
          {{ 'charges.chargeTypes.' + element.charge.type | transloco }}
        </ng-container>
        <ng-container *wattTableCell="columns.activePeriod; let element">
          {{ element.period | wattDate }}
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export class DhCharges {
  protected readonly navigation = inject(DhNavigationService);

  dataSource = new GetChargeOverviewDataSource();

  columns: WattTableColumnDef<ChargeOverviewItem> = {
    type: { accessor: (item) => item.charge.type, sort: false },
    code: { accessor: (item) => item.charge.code, sort: false },
    name: { accessor: (item) => item.charge.name, sort: false },
    owner: { accessor: (item) => item.charge.owner?.displayName, sort: false },
    period: { accessor: 'period' },
  };

  fetch = (query: ChargeOverviewQueryInput) => this.dataSource.refetch({ query });

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.charge.id === this.navigation.id());
  };
}
