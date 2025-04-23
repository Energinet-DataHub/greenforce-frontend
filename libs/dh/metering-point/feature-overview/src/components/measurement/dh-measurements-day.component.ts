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
import { Component, computed, effect, inject, input, LOCALE_ID, signal } from '@angular/core';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattSupportedLocales } from '@energinet-datahub/watt/date';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { Quality, GetMeasurementsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import { DhMeasurementsDayFilterComponent } from './dh-measurements-day-filter.component';
import { DhFormatObservationTimePipe } from './dh-format-observation-time.pipe';
import { MeasurementPosition, MeasurementsQueryVariables } from '../../types';
import { DhMeasurementsDayDetailsComponent } from './dh-measurements-day-details.component';
import { dhFormatMeasurementNumber } from '../../utils/dh-format-measurement-number';

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
    DhMeasurementsDayDetailsComponent,
  ],
  styles: `
    :host {
      .circle {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--watt-color-neutral-grey-500);
        display: inline-block;
      }
    }
  `,
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
        [activeRow]="activeRow()"
        (rowClick)="activeRow.set($event)"
      >
        <ng-container *wattTableCell="columns().observationTime; let element">
          {{ element.observationTime | dhFormatObservationTime: element.current.resolution }}
        </ng-container>

        <ng-container *wattTableCell="columns().currentQuantity; let element">
          @if (element.current.quality === Quality.Estimated) {
            ≈
          }
          {{ formatNumber(element.current.quantity) }}
        </ng-container>

        <ng-container *wattTableCell="columns().hasQuantityChanged; let element">
          @if (element.hasQuantityChanged) {
            <span class="circle"></span>
          }
        </ng-container>
      </watt-table>
    </watt-data-table>

    @let selectedRow = activeRow();

    @if (selectedRow) {
      <dh-measurements-day-details
        [selectedDay]="selectedDay()"
        [meteringPointId]="meteringPointId()"
        [measurementPosition]="selectedRow"
        (closed)="activeRow.set(undefined)"
      />
    }
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
  query = lazyQuery(GetMeasurementsDocument);
  meteringPointId = input.required<string>();

  dataSource = new WattTableDataSource<MeasurementPosition>([]);
  activeRow = signal<MeasurementPosition | undefined>(undefined);

  measurements = computed(() => this.query.data()?.measurements.measurementPositions ?? []);
  selectedDay = computed(() => this.query.getOptions().variables?.date);

  showHistoricValues = signal(false);

  Quality = Quality;

  columns = computed<WattTableColumnDef<MeasurementPosition>>(() => {
    const measurements = this.measurements();
    const numberOfColumnsNeeded = Math.max(0, ...measurements.map((x) => x.historic.length));
    const showHistoricValues = this.showHistoricValues();
    const columns: WattTableColumnDef<MeasurementPosition> = {
      position: {
        accessor: 'index',
        footer: { value: signal(this.transloco.translate('meteringPoint.measurements.sum')) },
      },
      observationTime: { accessor: 'observationTime' },
      currentQuantity: {
        accessor: null,
        align: 'right',
        footer: { value: this.sum },
      },
      hasQuantityChanged: {
        header: '',
        size: showHistoricValues && numberOfColumnsNeeded > 0 ? '100px' : '1fr',
        accessor: 'hasQuantityChanged',
      },
    };

    if (numberOfColumnsNeeded === 0 || !showHistoricValues) return columns;

    for (let i = 0; i < numberOfColumnsNeeded; i++) {
      columns[`column-${i}`] = {
        accessor: null,
        cell: (value) =>
          value.historic[i]?.quantity ? this.formatNumber(value.historic[i]?.quantity) : '',
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

  fetch(variables: MeasurementsQueryVariables) {
    const withMetertingPointId = {
      ...variables,
      metertingPointId: this.meteringPointId(),
    };

    this.showHistoricValues.set(variables.showHistoricValues ?? false);

    this.query.refetch(withMetertingPointId);
  }

  formatNumber(value: number) {
    return dhFormatMeasurementNumber(value, this.locale);
  }
}
