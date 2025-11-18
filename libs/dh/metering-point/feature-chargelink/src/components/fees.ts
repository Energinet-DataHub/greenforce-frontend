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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, input } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet/watt/core/date';
import { WattDataTableComponent } from '@energinet/watt/data';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import {
  ChargeType,
  GetChargeLinksByMeteringPointIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhMakeFormControl,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import { Charge } from '../types';

@Component({
  selector: 'dh-metering-point-charge-links-fees',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    TranslocoDirective,
    TranslocoPipe,

    WATT_TABLE,
    WattDatePipe,
    WattDataTableComponent,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      [header]="false"
      [enablePaginator]="false"
      *transloco="let t; prefix: 'meteringPoint.charges'"
      [error]="query.error()"
      [ready]="query.called() && !query.loading()"
    >
      <watt-table
        *transloco="let resolveHeader; prefix: 'meteringPoint.charges.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="query.loading()"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="navigation.navigate('details', $event.id)"
      >
        <ng-container *wattTableCell="columns.type; let element">
          {{ 'charges.chargeTypes.' + element.type | transloco }}
        </ng-container>

        <ng-container *wattTableCell="columns.date; let element">
          {{ element.period.start | wattDate }}
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export default class DhMeteringPointChargeLinksFees {
  id = input.required<string>();
  query = query(GetChargeLinksByMeteringPointIdDocument, () => ({
    variables: { meteringPointId: this.id() },
  }));
  navigation = inject(DhNavigationService);
  dataSource = dataSource(() =>
    (this.query.data()?.chargeLinksByMeteringPointId ?? []).filter(
      (chargeLink) => chargeLink.type === ChargeType.Fee
    )
  );
  chargeTypeOptions = dhEnumToWattDropdownOptions(ChargeType);

  form = new FormGroup({
    chargeTypes: dhMakeFormControl(),
  });

  columns: WattTableColumnDef<Charge> = {
    id: { accessor: 'id' },
    name: { accessor: 'name' },
    owner: { accessor: (charge) => charge.owner?.displayName ?? '' },
    amount: { accessor: 'amount' },
    date: { accessor: 'period' },
  };

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };
}
