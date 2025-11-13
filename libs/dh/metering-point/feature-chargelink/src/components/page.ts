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
import { RouterOutlet } from '@angular/router';
import { Component, computed, inject, input } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet/watt/core/date';
import { VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetChargeLinksByMeteringPointIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { Charge } from '../types';

@Component({
  selector: 'dh-metering-point-charge-links',
  imports: [
    RouterOutlet,
    TranslocoDirective,

    WATT_TABLE,
    WattDatePipe,
    WattDataTableComponent,
    WattDataFiltersComponent,
    VaterUtilityDirective,
  ],
  providers: [DhNavigationService],
  template: `<watt-data-table
      vater
      inset="ml"
      [enableCount]="false"
      [enableSearch]="false"
      [enablePaginator]="false"
      [error]="query.error()"
      [ready]="query.called() && !query.loading()"
    >
      <watt-data-filters />

      <watt-table
        *transloco="let resolveHeader; prefix: 'meteringPoint.charges.columns'"
        [dataSource]="dataSource()"
        [columns]="columns"
        [loading]="query.loading()"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="navigation.navigate('details', $event.id)"
      >
        <ng-container *wattTableCell="columns.period; let element">
          {{ element.period | wattDate }}
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />`,
})
<<<<<<<< HEAD:libs/dh/metering-point/feature-chargelink/src/components/page.ts
export default class DhMeteringPointChargeLinkPage {
========
export default class DhMeteringPointCharges {
>>>>>>>> origin:libs/dh/metering-point/feature-chargelink/src/components/chargelinks.ts
  id = input.required<string>();
  query = query(GetChargeLinksByMeteringPointIdDocument, () => ({
    variables: { meteringPointId: this.id() },
  }));
  navigation = inject(DhNavigationService);
  dataSource = computed(
    () => new WattTableDataSource(this.query.data()?.chargeLinksByMeteringPointId ?? [])
  );

  columns: WattTableColumnDef<Charge> = {
    type: { accessor: 'type' },
    id: { accessor: 'id' },
    name: { accessor: 'name' },
    owner: { accessor: 'owner' },
    amount: { accessor: 'amount' },
    period: { accessor: 'period' },
  };

  selection = () => {
    return this.dataSource().filteredData.find((row) => row.id === this.navigation.id());
  };
}
