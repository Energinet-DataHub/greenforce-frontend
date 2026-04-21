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
import { Component, computed, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WATT_TABLE, dataSource, WattTableColumnDef } from '@energinet/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
import { WattDatePipe } from '@energinet/watt/core/date';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattSlideToggleComponent } from '@energinet/watt/slide-toggle';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  ChargeType,
  GetChargeLinkOverviewDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhMakeFormControl,
  dhFormControlToSignal,
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';
import { DhChargesStatus } from '@energinet-datahub/dh/charges/feature-ui-shared';

import { ChargeLinkOverview } from '../types';
import { DhChargeLinkDetails } from './details';

const TARIFF_SUBSCRIPTIONS = Object.values(ChargeType).filter((t) => t !== ChargeType.Fee);

@Component({
  selector: 'dh-metering-point-charge-links-tariff-subscriptions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    TranslocoDirective,
    VATER,
    WATT_TABLE,
    WattDatePipe,
    WattDropdownComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattSlideToggleComponent,
    WattIconComponent,
    WattTooltipDirective,
    DhChargeLinkDetails,
    DhChargesStatus,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <watt-data-table
      [header]="false"
      [enablePaginator]="false"
      *transloco="let t; prefix: 'meteringPoint.chargeLinks'"
      [error]="chargeLinks.error()"
      [ready]="chargeLinks.called() && !chargeLinks.loading()"
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
        [activeRow]="selected() ?? undefined"
        (rowClick)="selected.set($event)"
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
          {{ element.period | wattDate }}
          @if (element.period.start.getTime() === element.period.end?.getTime()) {
            <dh-charges-status [status]="'CANCELLED'" />
          }
        </vater-stack>
      </watt-table>
    </watt-data-table>
    <dh-charge-link-details [(item)]="selected" />
  `,
})
export default class DhMeteringPointChargeLinksTariffSubscriptions {
  readonly meteringPointId = input.required<string>();
  protected chargeLinks = query(GetChargeLinkOverviewDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
    },
  }));

  selected = signal<ChargeLinkOverview | undefined>(undefined);
  showClosed = signal(false);

  form = new FormGroup({ chargeTypes: dhMakeFormControl<ChargeType[]>() });
  chargeTypeOptions = dhEnumToWattDropdownOptions(ChargeType, [ChargeType.Fee]);
  chargeTypes = dhFormControlToSignal(this.form.controls.chargeTypes);
  types = computed(() => this.chargeTypes() ?? TARIFF_SUBSCRIPTIONS);

  items = computed(() => this.chargeLinks.data()?.chargeLinkOverview ?? []);
  tariffsSubs = computed(() => this.items().filter((i) => this.types().includes(i.charge.type)));
  dataSource = dataSource(() => this.tariffsSubs().filter((i) => !i.closed || this.showClosed()));
  columns: WattTableColumnDef<ChargeLinkOverview> = {
    type: { accessor: (item) => item.charge.type },
    id: { accessor: (item) => item.charge.code },
    name: { accessor: (item) => item.charge.name ?? '' },
    owner: { accessor: (item) => item.charge.owner?.displayName ?? '' },
    transparentInvoicing: {
      header: '',
      accessor: (item) => item.charge.transparentInvoicing ?? false,
    },
    amount: { accessor: 'amount' },
    period: { accessor: (item) => item.period },
  };
}
