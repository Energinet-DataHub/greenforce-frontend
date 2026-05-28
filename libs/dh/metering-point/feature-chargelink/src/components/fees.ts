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
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WATT_TABLE, dataSource, WattTableColumnDef } from '@energinet/watt/table';
import { WattDataTableComponent } from '@energinet/watt/data';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';
import {
  ChargeType,
  GetChargeLinkPeriodsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhChargesStatus,
  DhChargePeriodPipe,
} from '@energinet-datahub/dh/charges/feature-ui-shared';

import { ChargeLinkPeriod } from '../types';

@Component({
  selector: 'dh-metering-point-charge-links-fees',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    VATER,
    WATT_TABLE,
    DhChargePeriodPipe,
    DhChargesStatus,
    WattDataTableComponent,
    RouterOutlet,
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
export default class DhMeteringPointChargeLinksFees {
  readonly meteringPointId = input.required<string>();

  page = inject(DhNavigationService);
  chargeLinks = query(GetChargeLinkPeriodsDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
    },
  }));

  periods = computed(() => this.chargeLinks.data()?.chargeLinkPeriods ?? []);
  activeRow = computed(() => this.periods().find((i) => i.id === this.page.id()));
  dataSource = dataSource(() => this.periods().filter((i) => i.charge.type === ChargeType.Fee));
  columns: WattTableColumnDef<ChargeLinkPeriod> = {
    type: { accessor: (item) => item.charge.type, sort: false },
    id: { accessor: (item) => item.charge?.code },
    name: { accessor: (item) => item.charge?.name ?? '' },
    owner: { accessor: (item) => item.charge?.owner?.displayName ?? '' },
    amount: { accessor: 'amount' },
    period: { accessor: (item) => item.period.start },
  };
}
