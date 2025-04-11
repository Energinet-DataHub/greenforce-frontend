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
import { Component, computed, effect, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeasurementsByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { Measurement, QueryVariables } from '../../types';
import { DhMeasurementsDayFilterComponent } from './dh-measurements-day-filter.component';

@Component({
  selector: 'dh-meter-data',
  imports: [
    TranslocoDirective,
    WATT_TABLE,
    WattDatePipe,
    WattDataTableComponent,
    WattDataFiltersComponent,
    VaterUtilityDirective,
    DhMeasurementsDayFilterComponent,
  ],
  template: `
    <watt-data-table
      vater
      inset="ml"
      [enableSearch]="false"
      [enableCount]="false"
      [error]="query.error()"
      [ready]="query.called()"
      [enablePaginator]="false"
      *transloco="let t; read: 'meteringPoint.measurements'"
    >
      <watt-data-filters>
        <dh-measurements-day-filter (filter)="fetch($event)" />
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; read: 'meteringPoint.measurements.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns"
        [dataSource]="dataSource"
        [loading]="query.loading()"
        sortDirection="desc"
        [sortClear]="false"
      >
        <ng-container *wattTableCell="columns.observationTime; let element">
          {{ element.observationTime | wattDate: 'long' }}
        </ng-container>

        <ng-container *wattTableCell="columns.quantity; let element">
          {{ element.quantity }}
        </ng-container>

        <ng-container *wattTableCell="columns.quality; let element">
          {{ t('qualities.' + element.quality) }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsComponent {
  query = lazyQuery(GetMeasurementsByIdDocument);
  meteringPointId = input.required<string>();

  dataSource = new WattTableDataSource<Measurement>([]);

  measurements = computed(() => this.query.data()?.measurements ?? []);

  columns: WattTableColumnDef<Measurement> = {
    observationTime: { accessor: 'observationTime' },
    quantity: { accessor: 'quantity' },
    quality: { accessor: 'quality' },
  };

  constructor() {
    effect(() => {
      this.dataSource.data = this.measurements();
    });
  }

  fetch(variables: QueryVariables) {
    const withMetertingPointId = {
      ...variables,
      metertingPointId: this.meteringPointId(),
    };

    this.query.refetch(withMetertingPointId);
  }
}
