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
import { TranslocoDirective } from '@jsverse/transloco';

import { Component, input } from '@angular/core';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DecimalPipe } from '@angular/common';
import { MeteringGridAreaImbalancePerDay } from '../../types';

@Component({
  selector: 'dh-metering-gridarea-imbalance-table',
  template: `<vater-flex
    fill="vertical"
    autoSize
    *transloco="let t; prefix: 'eSett.meteringGridAreaImbalance.drawer.table'"
    ><watt-table [columns]="columns" [dataSource]="data()!">
      <ng-container
        *wattTableCell="columns['imbalanceDay']; header: t('columns.date'); let imbalance"
      >
        {{ imbalance.imbalanceDay | wattDate: 'short' }}
      </ng-container>

      <ng-container *wattTableCell="columns['time']; header: t('columns.time'); let imbalance">
        {{ imbalance.firstOccurrenceOfImbalance | wattDate: 'time' }} ({{
          t('columns.position') + imbalance.firstPositionOfImbalance
        }})
      </ng-container>

      <ng-container
        *wattTableCell="columns['quantity']; header: t('columns.imbalance'); let imbalance"
      >
        {{ imbalance.quantity | number: '1.3-6' }}
      </ng-container>
    </watt-table>
  </vater-flex>`,
  styles: `
    watt-table {
      margin: var(--watt-space-m) 0;
    }
  `,
  imports: [WATT_TABLE, VaterFlexComponent, DecimalPipe, WattDatePipe, TranslocoDirective],
})
export class DhDrawerImbalanceTableComponent {
  data = input<WattTableDataSource<MeteringGridAreaImbalancePerDay>>();

  columns: WattTableColumnDef<MeteringGridAreaImbalancePerDay> = {
    imbalanceDay: { accessor: 'imbalanceDay', sort: false },
    time: { accessor: 'firstOccurrenceOfImbalance', sort: false },
    quantity: { accessor: 'quantity', sort: false, align: 'right' },
  };
}
