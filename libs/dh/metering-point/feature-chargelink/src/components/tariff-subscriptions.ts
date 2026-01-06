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
import { Component, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet/watt/core/date';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhChargesStatus } from '@energinet-datahub/dh/charges/ui-shared';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

import {
  ChargeType,
  GetChargeLinksByMeteringPointIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhMakeFormControl,
  dhFormControlToSignal,
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';

import { Charge } from '../types';
@Component({
  selector: 'dh-metering-point-charge-links-tariff-subscriptions',
  imports: [
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_TABLE,
    WattDatePipe,
    WattDropdownComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattTooltipDirective,
    WattIconComponent,
    DhDropdownTranslatorDirective,
    DhChargesStatus,
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
          {{ 'charges.chargeTypes.' + element.charge?.type | transloco }}
        </ng-container>

        <ng-container *wattTableCell="columns.period; let element">
          {{ element.currentPeriod?.period | wattDate }}
        </ng-container>

        <ng-container *wattTableCell="columns.transparentInvoicing; let element">
          @if (element.charge?.transparentInvoicing) {
            <watt-icon name="forward" size="s" [wattTooltip]="t('tooltip.transparentInvoicing')" />
          }
        </ng-container>
        <ng-container *wattTableCell="columns.status; let element">
          @let status = element.charge?.status;
          @if (status && status === 'CANCELLED') {
            <dh-charges-status [status]="status" />
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export default class DhMeteringPointChargeLinksTariffSubscriptions {
  meteringPointId = input.required<string>();
  query = query(GetChargeLinksByMeteringPointIdDocument, () => ({
    variables: { meteringPointId: this.meteringPointId() },
  }));
  navigation = inject(DhNavigationService);
  dataSource = dataSource(() =>
    (this.query.data()?.chargeLinksByMeteringPointId ?? []).filter(
      (chargeLink) =>
        chargeLink.charge?.type != ChargeType.Fee &&
        (this.typeFilterChanged()?.includes(chargeLink.charge?.type) ?? true)
    )
  );

  chargeTypeOptions = dhEnumToWattDropdownOptions(ChargeType, [ChargeType.Fee]);

  form = new FormGroup({
    chargeTypes: dhMakeFormControl(),
  });

  typeFilterChanged = dhFormControlToSignal(this.form.controls.chargeTypes);

  columns: WattTableColumnDef<Charge> = {
    type: { accessor: (chargeLink) => chargeLink.charge?.type },
    id: { accessor: (chargeLink) => chargeLink.charge?.code },
    name: { accessor: (chargeLink) => chargeLink.charge?.name ?? '' },
    owner: { accessor: (chargeLink) => chargeLink.charge?.owner?.displayName ?? '' },
    transparentInvoicing: {
      header: '',
      accessor: (chargeLink) => chargeLink.charge?.transparentInvoicing ?? false,
    },
    amount: { accessor: 'amount' },
    period: { accessor: (chargeLink) => chargeLink.currentPeriod?.period },
    status: { header: '', accessor: (charge) => charge.charge?.status },
  };

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };
}
