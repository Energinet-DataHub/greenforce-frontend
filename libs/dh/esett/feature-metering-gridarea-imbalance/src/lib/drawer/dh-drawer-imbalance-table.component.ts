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
import { TranslocoDirective } from '@ngneat/transloco';

import { Component, OnInit, input } from '@angular/core';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { MeteringGridAreaImbalancePerDayDto } from '../dh-metering-gridarea-imbalance';
import { DecimalPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'dh-metering-gridarea-imbalance-table',
  template: `<vater-flex
    fill="vertical"
    scrollable
    *transloco="let t; read: 'eSett.meteringGridAreaImbalance.drawer.table'"
    ><watt-table [columns]="columns" [dataSource]="getDataSource()">
      <ng-container
        *wattTableCell="columns['imbalanceDay']; header: t('columns.date'); let imbalance"
      >
        {{ imbalance.imbalanceDay | wattDate: 'short' }}
      </ng-container>

      <ng-container *wattTableCell="columns['time']; header: t('columns.time'); let imbalance">
        {{ imbalance.firstOccurrenceOfImbalance | wattDate: 'time' }}
      </ng-container>

      <ng-container
        *wattTableCell="columns['incomingQuantity']; header: t('columns.imbalance'); let imbalance"
      >
        {{ imbalance.incomingQuantity | number: '1.5-6' }}
      </ng-container>

      <ng-container
        *wattTableCell="columns['outgoingQuantity']; header: t('columns.imbalance'); let imbalance"
      >
        {{ imbalance.outgoingQuantity | number: '1.5-6' }}
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
export class DhDrawerImbalanceTableComponent implements OnInit {
  surplus = input<WattTableDataSource<MeteringGridAreaImbalancePerDayDto>>();
  deficit = input<WattTableDataSource<MeteringGridAreaImbalancePerDayDto>>();

  columns!: WattTableColumnDef<MeteringGridAreaImbalancePerDayDto>;

  ngOnInit(): void {
    this.columns = {
      imbalanceDay: { accessor: 'imbalanceDay', sort: false },
      time: { accessor: 'firstOccurrenceOfImbalance', sort: false },
      ...(this.surplus() !== undefined
        ? {
            incomingQuantity: {
              accessor: 'incomingQuantity',
              sort: false,
            },
          }
        : {}),
      ...(this.deficit() !== undefined
        ? {
            outgoingQuantity: {
              accessor: 'outgoingQuantity',
              sort: false,
            },
          }
        : {}),
    };
  }

  getDataSource(): WattTableDataSource<MeteringGridAreaImbalancePerDayDto> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.surplus() !== undefined ? this.surplus()! : this.deficit()!;
  }
}
