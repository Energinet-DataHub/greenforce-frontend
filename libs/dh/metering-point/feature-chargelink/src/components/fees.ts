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
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WATT_TABLE, dataSource, WattTableColumnDef } from '@energinet/watt/table';
import { WattDataTableComponent } from '@energinet/watt/data';
import { WattDatePipe } from '@energinet/watt/core/date';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';
import {
  ChargeType,
  GetChargeLinkOverviewDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhChargesStatus } from '@energinet-datahub/dh/charges/feature-ui-shared';

import { ChargeLinkOverview } from '../types';
import { DhChargeLinkDetails } from './details';

@Component({
  selector: 'dh-metering-point-charge-links-fees',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    VATER,
    WATT_TABLE,
    WattDatePipe,
    WattDataTableComponent,
    DhChargesStatus,
    DhChargeLinkDetails,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      [header]="false"
      [enablePaginator]="false"
      *transloco="let t; prefix: 'meteringPoint.chargeLinks'"
      [error]="chargeLinks.error()"
      [ready]="chargeLinks.called() && !chargeLinks.loading()"
    >
      <watt-table
        *transloco="let resolveHeader; prefix: 'meteringPoint.chargeLinks.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="chargeLinks.loading()"
        [resolveHeader]="resolveHeader"
        [activeRow]="selected()"
        (rowClick)="selected.set($event)"
      >
        <ng-container *wattTableCell="columns.type; let element">
          {{ element.charge.typeDisplayName }}
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
export default class DhMeteringPointChargeLinksFees {
  readonly meteringPointId = input.required<string>();
  protected chargeLinks = query(GetChargeLinkOverviewDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
    },
  }));

  selected = signal<ChargeLinkOverview | undefined>(undefined);
  items = computed(() => this.chargeLinks.data()?.chargeLinkOverview ?? []);
  dataSource = dataSource(() => this.items().filter((i) => i.charge.type === ChargeType.Fee));
  columns: WattTableColumnDef<ChargeLinkOverview> = {
    type: { accessor: (item) => item.charge.type },
    id: { accessor: (item) => item.charge?.code },
    name: { accessor: (item) => item.charge?.name ?? '' },
    owner: { accessor: (item) => item.charge?.owner?.displayName ?? '' },
    amount: { accessor: 'amount' },
    period: { accessor: (item) => item.period },
  };
}
