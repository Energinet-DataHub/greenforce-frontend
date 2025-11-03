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
import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { dayjs } from '@energinet/watt/date';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';
import {
  ChargeResolution,
  ChargeSeries,
  GetChargeResolutionDocument,
  GetChargeSeriesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhCircleComponent } from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { capitalize } from '@energinet-datahub/dh/shared/util-text';

@Component({
  selector: 'dh-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    VaterStackComponent,
    WattDatepickerComponent,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WATT_TABLE,
    DhCircleComponent,
  ],
  template: `
    <watt-data-table
      [header]="false"
      [error]="series.error()"
      [ready]="series.called()"
      [enablePaginator]="false"
      *transloco="let t; prefix: 'charges.series'"
    >
      <watt-data-filters>
        <watt-datepicker />
      </watt-data-filters>
      <watt-table
        *transloco="let t; read: 'charges.series.columns'"
        [resolveHeader]="t"
        [columns]="columns"
        [dataSource]="dataSource"
        [loading]="series.loading()"
        [stickyFooter]="true"
      >
        <ng-container *wattTableCell="columns.date; header: t(resolution()); let _; let i = index">
          {{ formatTime(i) }}
        </ng-container>
        <ng-container *wattTableCell="columns.history; header: ''; let series">
          <vater-stack direction="row" gap="xl">
            @if (series.points.length > 1) {
              <dh-circle />
            }
            @for (point of series.points; track $index) {
              <span class="watt-on-light--medium-emphasis">{{ point.price }}</span>
            }
          </vater-stack>
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhChargeSeriesDay {
  id = input.required<string>();
  charge = query(GetChargeResolutionDocument, () => ({ variables: { id: this.id() } }));
  resolution = computed(() => this.charge.data()?.chargeById?.resolution ?? 'Unknown');
  series = query(GetChargeSeriesDocument, () => ({
    variables: {
      interval: { start: new Date(), end: new Date() },
      chargeId: this.id(),
    },
  }));

  dataSource = new WattTableDataSource<ChargeSeries>();
  columns: WattTableColumnDef<ChargeSeries> = {
    date: { accessor: null },
    price: {
      accessor: (row) => row.points.find((r) => r.toDateTime > new Date())?.price,
      align: 'right',
    },
    history: { accessor: null, tooltip: 'What', size: '1fr' },
  };

  formatTime = (index: number) => {
    const today = dayjs();
    switch (this.resolution()) {
      case 'QuarterHourly':
        return `${today.minute(index * 15).format('mm')} — ${today.minute((index + 1) * 15).format('mm')}`;
      case 'Hourly':
        return `${today.hour(index).format('HH')} — ${today.hour(index + 1).format('HH')}`;
      case 'Daily':
        return today.date(index + 1).format('DD');
      case 'Monthly':
        return capitalize(today.month(index).format('MMMM'));
      case 'Unknown':
        return index + 1;
    }
  };

  constructor() {
    effect(() => {
      this.dataSource.data = this.series.data()?.chargeSeries ?? [];
    });
  }
}
