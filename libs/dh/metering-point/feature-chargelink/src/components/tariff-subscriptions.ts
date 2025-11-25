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
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
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
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
@Component({
  selector: 'dh-metering-point-charge-links-tariff-subscriptions',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    TranslocoDirective,
    TranslocoPipe,
    WATT_TABLE,
    WattDatePipe,
    WattDropdownComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattTooltipDirective,
    WattIconComponent,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      [header]="false"
      [enablePaginator]="false"
      *transloco="let t; prefix: 'meteringPoint.chargeLinks'"
      [error]="query.error()"
      [ready]="query.called() && !query.loading()"
    >
      <watt-data-filters>
        <watt-dropdown
          [formControl]="this.form.controls.chargeTypes"
          [chipMode]="true"
          [multiple]="true"
          [options]="chargeTypeOptions"
          [placeholder]="t('chargeType')"
          dhDropdownTranslator
          translateKey="charges.chargeTypes"
        />
      </watt-data-filters>

      <watt-table
        *transloco="let resolveHeader; prefix: 'meteringPoint.chargeLinks.columns'"
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

        <ng-container *wattTableCell="columns.period; let element">
          {{ element.period | wattDate }}
        </ng-container>

        <ng-container *wattTableCell="columns.transparentInvoicing; let element">
          @if (element.charge?.currentPeriod?.transparentInvoicing) {
            <watt-icon name="forward" size="s" [wattTooltip]="t('tooltip.transparentInvoicing')" />
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export default class DhMeteringPointChargeLinksTariffSubscriptions {
  id = input.required<string>();
  query = query(GetChargeLinksByMeteringPointIdDocument, () => ({
    variables: { meteringPointId: this.id() },
  }));
  navigation = inject(DhNavigationService);
  dataSource = dataSource(() =>
    (this.query.data()?.chargeLinksByMeteringPointId ?? []).filter(
      (chargeLink) => chargeLink.type != ChargeType.Fee
    )
  );

  chargeTypeOptions = dhEnumToWattDropdownOptions(ChargeType);

  form = new FormGroup({
    chargeTypes: dhMakeFormControl(),
  });

  columns: WattTableColumnDef<Charge> = {
    type: { accessor: 'type' },
    id: { accessor: 'id' },
    name: { accessor: 'name' },
    owner: { accessor: (chargeLink) => chargeLink.owner?.displayName ?? '' },
    transparentInvoicing: {
      header: '',
      accessor: (chargeLink) => chargeLink.charge?.currentPeriod?.transparentInvoicing ?? false,
    },
    amount: { accessor: 'amount' },
    period: { accessor: 'period' },
  };

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };
}
