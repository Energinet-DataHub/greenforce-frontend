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
import { Component, computed, effect, inject, input, LOCALE_ID, signal } from '@angular/core';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattSupportedLocales } from '@energinet-datahub/watt/date';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { GetMeasurementsWithHistoryDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import { DhMeasurementsDayFilterComponent } from './dh-measurements-day-filter.component';
import { DhFormatObservationTimePipe } from './dh-format-observation-time.pipe';
import { MeasurementPosition, MeasurementsWithHistoryQueryVariables } from '../../types';

@Component({
  selector: 'dh-measurements-day',
  imports: [
    TranslocoDirective,
    WATT_TABLE,
    WattDataTableComponent,
    WattDataFiltersComponent,
    VaterUtilityDirective,
    DhMeasurementsDayFilterComponent,
    DhFormatObservationTimePipe,
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
        [columns]="columns()"
        [dataSource]="dataSource"
        [loading]="query.loading()"
        sortDirection="desc"
        [sortClear]="false"
        [stickyFooter]="true"
      >
        <ng-container *wattTableCell="columns().observationTime; let element">
          {{ element.observationTime | dhFormatObservationTime: element.current.resolution }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsDayComponent {
  private transloco = inject(TranslocoService);
  private locale = inject<WattSupportedLocales>(LOCALE_ID);
  private sum = computed(
    () =>
      `${this.formatNumber(this.measurements().reduce((acc, x) => acc + x.current.quantity, 0))} ${this.unit()}`
  );
  private unit = computed(() => {
    const currentMeasurement = this.measurements()[0]?.current;
    if (!currentMeasurement) return '';
    return this.transloco.translate('meteringPoint.measurements.units.' + currentMeasurement.unit);
  });
  query = lazyQuery(GetMeasurementsWithHistoryDocument);
  meteringPointId = input.required<string>();

  dataSource = new WattTableDataSource<MeasurementPosition>([]);

  measurements = computed(
    () => this.query.data()?.measurementsWithHistory.measurementPositions ?? []
  );

  columns = computed<WattTableColumnDef<MeasurementPosition>>(() => {
    const measurements = this.measurements();
    const columns: WattTableColumnDef<MeasurementPosition> = {
      position: {
        accessor: 'index',
        footer: { value: signal(this.transloco.translate('meteringPoint.measurements.sum')) },
      },
      observationTime: { accessor: 'observationTime' },
      currentQuantity: {
        accessor: (value) => this.formatNumber(value.current.quantity),
        align: 'right',
        footer: { value: this.sum },
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
        size: i + 1 === numberOfColumnsNeeded ? '1fr' : 'auto',
      };
    }

    return columns;
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.measurements();
    });
  }

  fetch(variables: MeasurementsWithHistoryQueryVariables) {
    const withMetertingPointId = {
      ...variables,
      metertingPointId: this.meteringPointId(),
    };

    this.query.refetch(withMetertingPointId);
  }

  formatNumber(value: number) {
    return formatNumber(value, this.locale, '1.3');
  }
}
