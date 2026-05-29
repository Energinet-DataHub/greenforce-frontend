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
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WATT_TABLE, dataSource, WattTableColumnDef } from '@energinet/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';

import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattSlideToggleComponent } from '@energinet/watt/slide-toggle';

import {
  ChargeType,
  GetChargeLinkPeriodsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhMakeFormControl,
  dhFormControlToSignal,
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';
import {
  DhChargesStatus,
  DhChargePeriodPipe,
} from '@energinet-datahub/dh/charges/feature-ui-shared';

import { ChargeLinkPeriod } from '../types';

const TARIFF_SUBSCRIPTIONS = [ChargeType.Tariff, ChargeType.TariffTax, ChargeType.Subscription];

@Component({
  selector: 'dh-charge-links-tariff-subscriptions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VATER,
    WATT_TABLE,
    DhChargePeriodPipe,
    WattDropdownComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattSlideToggleComponent,
    WattIconComponent,
    WattTooltipDirective,
    RouterOutlet,
    DhChargesStatus,
    DhDropdownTranslatorDirective,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      [header]="false"
      [enablePaginator]="false"
      *transloco="let t; prefix: 'meteringPoint.chargeLinks'"
      [error]="chargeLinks.error()"
      [ready]="chargeLinks.called()"
    >
      <watt-data-filters>
        <vater-stack direction="row" gap="m">
          <watt-dropdown
            [formControl]="this.form.controls.chargeTypes"
            [chipMode]="true"
            [multiple]="true"
            [options]="chargeTypeOptions"
            [placeholder]="t('chargeType')"
            dhDropdownTranslator
            translateKey="charges.chargeTypes"
          />
          <watt-slide-toggle [(checked)]="showClosed">{{ t('showClosed') }}</watt-slide-toggle>
        </vater-stack>
      </watt-data-filters>

      <watt-table
        *transloco="let resolveHeader; prefix: 'meteringPoint.chargeLinks.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="chargeLinks.loading()"
        [resolveHeader]="resolveHeader"
        [activeRow]="activeRow()"
        (rowClick)="page.navigate('id', $event.id)"
      >
        <ng-container *wattTableCell="columns.type; let element">
          {{ element.charge.typeDisplayName }}
        </ng-container>

        <ng-container *wattTableCell="columns.amount; let element">
          @if (element.charge.type === 'SUBSCRIPTION') {
            {{ element.amount }}
          }
        </ng-container>

        <ng-container *wattTableCell="columns.transparentInvoicing; let element">
          @if (element.charge.transparentInvoicing) {
            <watt-icon name="forward" size="s" [wattTooltip]="t('tooltip.transparentInvoicing')" />
          }
        </ng-container>

        <vater-stack direction="row" gap="s" *wattTableCell="columns.period; let element">
          {{ element.period | dhChargePeriod }}
          @if (element.cancelled) {
            <dh-charges-status [status]="'CANCELLED'" />
          }
        </vater-stack>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export default class DhChargeLinksTariffSubscriptions {
  protected page = inject(DhNavigationService);

  readonly meteringPointId = input.required<string>();
  readonly showClosed = signal(false);

  chargeLinks = query(GetChargeLinkPeriodsDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
    },
  }));

  form = new FormGroup({ chargeTypes: dhMakeFormControl<ChargeType[]>() });
  chargeTypeOptions = dhEnumToWattDropdownOptions(ChargeType, [ChargeType.Fee]);
  chargeTypes = dhFormControlToSignal(this.form.controls.chargeTypes);
  types = computed(() => this.chargeTypes() ?? TARIFF_SUBSCRIPTIONS);

  periods = computed(() => this.chargeLinks.data()?.chargeLinkPeriods ?? []);
  activeRow = computed(() => this.periods().find((i) => i.id === this.page.id()));
  tariffsSubs = computed(() => this.periods().filter((i) => this.types().includes(i.charge.type)));
  dataSource = dataSource(() => this.tariffsSubs().filter((i) => !i.closed || this.showClosed()));
  columns: WattTableColumnDef<ChargeLinkPeriod> = {
    type: { accessor: (item) => item.charge.type },
    id: { accessor: (item) => item.charge.code },
    name: { accessor: (item) => item.charge.name ?? '' },
    transparentInvoicing: {
      header: '',
      accessor: (item) => item.charge.transparentInvoicing ?? false,
      size: 'min-content',
    },
    owner: { accessor: (item) => item.charge.owner?.displayName ?? '' },
    amount: {
      accessor: (item) => (item.charge.type === ChargeType.Subscription ? item.amount : null),
    },
    period: { accessor: (item) => item.period.start },
  };
}
