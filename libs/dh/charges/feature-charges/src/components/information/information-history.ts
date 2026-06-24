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
import { Component, computed, inject, input } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WATT_CARD } from '@energinet/watt/card';
import { WattDatePipe, wattFormatDate } from '@energinet/watt/date';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableCellDirective,
  dataSource,
} from '@energinet/watt/table';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetChargeHistoryDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

import { ChargeChange } from '../../types';

type HistoryRow = {
  type: string;
  createdAt: Date;
  effectiveDate: string;
  previous?: string;
  current?: string;
};

@Component({
  selector: 'dh-charges-information-history',
  imports: [
    TranslocoDirective,
    VATER,
    WATT_CARD,
    WattDatePipe,
    WattTableComponent,
    WattTableCellDirective,
    DhResultComponent,
  ],
  template: `
    <watt-card vater inset="ml" variant="solid" *transloco="let t; prefix: 'charges.history'">
      <dh-result vater fill="vertical" [query]="history">
        <watt-table
          [columns]="columns"
          [dataSource]="dataSource"
          [hideColumnHeaders]="true"
          [sortClear]="false"
          sortBy="created"
          sortDirection="desc"
        >
          <ng-container *wattTableCell="columns.created; let row">
            {{ row.createdAt | wattDate: 'long' }}
          </ng-container>
          <ng-container *wattTableCell="columns.description; let row">
            {{ t(row.type, row) }}
          </ng-container>
        </watt-table>
      </dh-result>
    </watt-card>
  `,
})
export class DhChargesInformationHistory {
  private transloco = inject(TranslocoService);
  readonly id = input.required<string>();

  history = query(GetChargeHistoryDocument, () => ({
    variables: { id: this.id() },
    notifyOnNetworkStatusChange: false,
    pollInterval: 10_000,
  }));

  changes = computed(() => this.history.data()?.chargeById?.history ?? []);
  dataSource = dataSource(() => this.changes().map(this.mapToHistoryRow));
  columns: WattTableColumnDef<HistoryRow> = {
    created: { accessor: 'createdAt', size: 'auto' },
    description: { accessor: null, size: '1fr' },
  };

  private mapToHistoryRow = (change: ChargeChange) => {
    const t = (key: string) => this.transloco.translate(`charges.${key}`);
    const row: HistoryRow = {
      type: change.__typename,
      createdAt: change.createdAt,
      effectiveDate: wattFormatDate(change.effectiveDate, 'short'),
    };

    switch (change.__typename) {
      case 'ChargeNameChanged':
        return {
          ...row,
          previous: change.previousName,
          current: change.currentName,
        };
      case 'ChargeDescriptionChanged':
        return {
          ...row,
          previous: change.previousDescription,
          current: change.currentDescription,
        };
      case 'ChargeVatChanged':
        return {
          ...row,
          previous: t(`vatInclusive.${change.previousVat}`),
          current: t(`vatInclusive.${change.currentVat}`),
        };
      case 'ChargeTransparentInvoicingChanged':
        return {
          ...row,
          previous: t(`transparentInvoicing.${change.previousTransparentInvoicing}`),
          current: t(`transparentInvoicing.${change.currentTransparentInvoicing}`),
        };
      default:
        return row;
    }
  };
}
