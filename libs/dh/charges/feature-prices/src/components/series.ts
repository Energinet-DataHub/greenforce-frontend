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
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';
import {
  ChargeSeries,
  ChargeSeriesPoint,
  GetChargeByIdDocument,
  GetChargeSeriesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhCircleComponent } from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import formatTime from '../format-time';
import { DhChargeSeriesDetailsComponent } from './series/details';

@Component({
  selector: 'dh-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    VaterStackComponent,
    VaterUtilityDirective,
    WattDatepickerComponent,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WATT_TABLE,
    DhCircleComponent,
    DhChargeSeriesDetailsComponent,
  ],
  template: `
    <watt-data-table
      vater
      inset="ml"
      gap="ml"
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
        (rowClick)="details.open(getIndex($event), $event, resolution(), charge.data()?.chargeById)"
      >
        <ng-container *wattTableCell="columns.date; header: t(resolution()); let _; let i = index">
          {{ formatTime(i) }}
        </ng-container>
        <ng-container *wattTableCell="columns.hasChanged; header: ''; let series">
          @if (series.hasChanged) {
            <dh-circle />
          }
        </ng-container>
        <ng-container *wattTableCell="columns.history; header: ''; let series">
          <vater-stack direction="row" gap="xl">
            @for (point of series.points.filter(isHistoric); track $index) {
              <span class="watt-on-light--medium-emphasis">{{ point.price }}</span>
            }
          </vater-stack>
        </ng-container>
      </watt-table>
    </watt-data-table>
    <dh-charge-series-details #details />
  `,
})
export class DhChargeSeriesPage {
  id = input.required<string>();
  charge = query(GetChargeByIdDocument, () => ({ variables: { id: this.id() } }));
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
      accessor: (row) => row.points.find((r) => r.isCurrent)?.price,
      align: 'right',
    },
    hasChanged: { accessor: (row) => row.hasChanged, tooltip: 'What' },
    history: { accessor: null, size: '1fr' },
  };

  isHistoric = (point: ChargeSeriesPoint) => !point.isCurrent;

  formatTime = (index: number) => formatTime(index, this.resolution());

  getIndex = (selectedSeries: ChargeSeries) =>
    this.series.data()?.chargeSeries.indexOf(selectedSeries) ?? 0;

  constructor() {
    effect(() => {
      this.dataSource.data = this.series.data()?.chargeSeries ?? [];
    });
  }
}
