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

import { dayjs, WattSupportedLocales } from '@energinet-datahub/watt/date';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetMeasurementsById_V2Document,
  Resolution,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { MeasurementPositionV2, QueryVariablesV2 } from '../../types';
import { DhMeasurementsFilterComponent } from './dh-measurements-filter.component';

@Component({
  selector: 'dh-meter-data-v2',
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
          {{ this.formatObservationTime(element.observationTime, element.current.resolution) }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsV2Component {
  private transloco = inject(TranslocoService);
  private locale = inject<WattSupportedLocales>(LOCALE_ID);
  private sum = computed(
    () =>
      `${this.formatNumber(this.measurements().reduce((acc, x) => acc + x.current.quantity, 0))} ${this.unit()}`
  );
  private unit = computed(() =>
    this.transloco.translate(
      'meteringPoint.measurements.units.' + this.measurements()[0]?.current.unit
    )
  );
  query = lazyQuery(GetMeasurementsById_V2Document);
  meteringPointId = input.required<string>();

  dataSource = new WattTableDataSource<MeasurementPositionV2>([]);

  measurements = computed(() => this.query.data()?.measurements_v2.measurementPositions ?? []);

  columns = computed<WattTableColumnDef<MeasurementPositionV2>>(() => {
    const measurements = this.measurements();
    const columns: WattTableColumnDef<MeasurementPositionV2> = {
      position: {
        accessor: null,
        cell: (value) => (this.measurements().findIndex((x) => x === value) + 1).toString(),
        footer: { value: signal(this.transloco.translate('meteringPoint.measurements.sum')) },
      },
      observationTime: { accessor: 'observationTime' },
      currentQuantity: {
        accessor: (value) => this.formatNumber(value.current.quantity),
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
      };
    }

    return columns;
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.measurements();
    });
  }

  fetch(variables: QueryVariablesV2) {
    const withMetertingPointId = {
      ...variables,
      metertingPointId: this.meteringPointId(),
    };

    this.query.refetch(withMetertingPointId);
  }

  formatNumber(value: number) {
    return formatNumber(value, this.locale, '1.3');
  }

  formatObservationTime(observationTime: Date, resolution: Resolution) {
    if (resolution === Resolution.Hour) {
      const firstHour = dayjs(observationTime).format('HH');
      const lastHour = dayjs(observationTime).add(1, 'hour').format('HH');
      return `${firstHour} — ${lastHour}`;
    }

    if (resolution === Resolution.Quarter) {
      const firstQuarter = dayjs(observationTime).format('HH:mm');
      const lastQuarter = dayjs(observationTime).add(15, 'minutes').format('HH:mm');
      return `${firstQuarter} — ${lastQuarter}`;
    }

    return '';
  }
}
