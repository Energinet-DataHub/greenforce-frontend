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
import { formatNumber } from '@angular/common';
import { Component, computed, effect, inject, input, LOCALE_ID } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { dayjs, WattSupportedLocales } from '@energinet-datahub/watt/date';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeasurementsByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { MeasurementPosition, QueryVariables } from '../types';
import { DhMeasurementsFilterComponent } from './dh-measurements-filter.component';

@Component({
  selector: 'dh-meter-data',
  imports: [
    TranslocoDirective,
    WATT_TABLE,
    WattDataTableComponent,
    WattDataFiltersComponent,
    VaterUtilityDirective,
    DhMeasurementsFilterComponent,
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
        <dh-measurements-filter (filter)="fetch($event)" />
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; read: 'meteringPoint.measurements.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns()"
        [dataSource]="dataSource"
        [loading]="query.loading()"
        sortDirection="desc"
        [sortClear]="false"
      >
        <ng-container *wattTableCell="columns().observationTime; let element">
          {{ this.formatObservationTime(element.observationTime) }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsComponent {
  private locale: WattSupportedLocales = inject(LOCALE_ID) as WattSupportedLocales;
  query = lazyQuery(GetMeasurementsByIdDocument);
  meteringPointId = input.required<string>();

  dataSource = new WattTableDataSource<MeasurementPosition>([]);

  measurements = computed(() => this.query.data()?.measurements.measurementPositions ?? []);

  columns = computed<WattTableColumnDef<MeasurementPosition>>(() => {
    const measurements = this.measurements();
    const columns: WattTableColumnDef<MeasurementPosition> = {
      position: {
        accessor: null,
        cell: (value) => (this.measurements().findIndex((x) => x === value) + 1).toString(),
      },
      observationTime: { accessor: 'observationTime' },
      currentQuantity: {
        accessor: (value) => this.formatNumber(value.current.quantity),
      },
    };

    if (measurements.length === 0) return columns;

    const numberOfColumnsNeeded = Math.max(
      0,
      ...measurements.map((x) => x.measurementPoints.length)
    );

    for (let i = 0; i < numberOfColumnsNeeded; i++) {
      columns[`column-${i}`] = {
        accessor: null,
        cell: (value) =>
          value.measurementPoints[i]?.quantity
            ? this.formatNumber(value.measurementPoints[i]?.quantity)
            : '',
        header: '',
      };
    }

    return columns;
  });

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

  formatNumber(value: number) {
    return formatNumber(value, this.locale, '1.3');
  }

  formatObservationTime(value: Date) {
    const firstHour = dayjs(value).format('HH');
    const lastHour = dayjs(value).add(1, 'hour').format('HH');
    return `${firstHour} - ${lastHour}`;
  }
}
