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
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';
import { ChargeSeries, GetChargeSeriesDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    WattDatepickerComponent,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WATT_TABLE,
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
        *transloco="let resolveHeader; read: 'charge.series.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns"
        [dataSource]="dataSource"
        [loading]="series.loading()"
        [stickyFooter]="true"
      >
        <ng-container *wattTableCell="columns.hour; let series">
          {{ series.totalAmount }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhChargeSeriesDay {
  id = input.required<string>();
  series = query(GetChargeSeriesDocument, () => ({
    variables: {
      interval: { start: new Date(), end: new Date() },
      chargeId: this.id(),
    },
  }));

  dataSource = new WattTableDataSource<ChargeSeries>();
  columns = {
    hour: { accessor: (row) => row.totalAmount },
  } satisfies WattTableColumnDef<ChargeSeries>;

  constructor() {
    effect(() => {
      this.dataSource.data = this.series.data()?.chargeSeries ?? [];
    });
  }
}
