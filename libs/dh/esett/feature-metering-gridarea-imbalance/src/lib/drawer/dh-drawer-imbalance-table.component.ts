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
import { Component, OnInit, input } from '@angular/core';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { MeteringGridAreaImbalancePerDayDto } from '../dh-metering-gridarea-imbalance';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { TranslocoDirective } from '@ngneat/transloco';

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
export enum ImbalanceType {
  surplus = 'surplus',
  deficit = 'deficit',
}

type MeteringGridAreaImbalancePerDayDtoExtended = MeteringGridAreaImbalancePerDayDto & {
  time: Date;
  position: number;
};

@Component({
  standalone: true,
  selector: 'dh-metering-gridarea-imbalance-table',
  template: `<vater-flex
    fill="vertical"
    scrollable
    *transloco="let t; read: 'eSett.meteringGridAreaImbalance.drawer.table'"
    ><watt-table [columns]="columns" [dataSource]="tableDataSource">
      <ng-container
        *wattTableCell="columns['position']; header: t('columns.position'); let imbalance"
      >
        {{ imbalance.position }}
      </ng-container>
      <ng-container
        *wattTableCell="columns['imbalanceDay']; header: t('columns.date'); let imbalance"
      >
        {{ imbalance.imbalanceDay | wattDate: 'short' }}
      </ng-container>

      <ng-container *wattTableCell="columns['time']; header: t('columns.time'); let imbalance">
        {{ imbalance.time | wattDate: 'time' }}
      </ng-container>

      <ng-container
        *wattTableCell="columns['incomingQuantity']; header: t('columns.imbalance'); let imbalance"
      >
        {{ (imbalance.incomingQuantity ?? 0) - (imbalance.outgoingQuantity ?? 0) }}
      </ng-container>

      <ng-container
        *wattTableCell="columns['outgoingQuantity']; header: t('columns.imbalance'); let imbalance"
      >
        {{ imbalance.outgoingQuantity }}
      </ng-container>
    </watt-table>
  </vater-flex>`,
  imports: [WATT_TABLE, VaterFlexComponent, WattDatePipe, TranslocoDirective],
})
export class DhDrawerImbalanceTableComponent implements OnInit {
  meteringGridAreaImbalancePerDays = input<MeteringGridAreaImbalancePerDayDto[] | undefined>();
  imbalanceType = input<ImbalanceType>();
  tableDataSource = new WattTableDataSource<MeteringGridAreaImbalancePerDayDtoExtended>([]);
  columns!: WattTableColumnDef<MeteringGridAreaImbalancePerDayDtoExtended>;

  ngOnInit(): void {
    this.tableDataSource.data = (this.meteringGridAreaImbalancePerDays() ?? [])
      .map((x, index) => ({
        outgoingQuantity: x.outgoingQuantity ?? 0,
        incomingQuantity: x.incomingQuantity ?? 0,
        imbalanceDay: x.imbalanceDay,
        time: x.imbalanceDay,
        position: index,
        __typename: x.__typename,
      }))
      .filter(
        (x) =>
          (x.outgoingQuantity - x.incomingQuantity > 0 &&
            this.imbalanceType() === ImbalanceType.surplus) ||
          (x.outgoingQuantity - x.incomingQuantity < 0 &&
            this.imbalanceType() === ImbalanceType.deficit)
      );
    this.columns = {
      position: { accessor: 'position', sort: false },
      imbalanceDay: { accessor: 'imbalanceDay', sort: false },
      time: { accessor: 'time', sort: false },
      ...(this.imbalanceType() === ImbalanceType.deficit
        ? {
            incomingQuantity: {
              accessor: 'incomingQuantity',
              sort: false,
            },
          }
        : {}),
      ...(this.imbalanceType() === ImbalanceType.surplus
        ? {
            outgoingQuantity: {
              accessor: 'outgoingQuantity',
              sort: false,
            },
          }
        : {}),
    };
  }
}
