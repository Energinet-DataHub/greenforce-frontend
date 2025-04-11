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
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, formatNumber } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Component, computed, effect, inject, input, LOCALE_ID, signal } from '@angular/core';

import { map, startWith } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import {
  Resolution,
  GetAggregatedMeasurementsForMonthDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { dayjs, WattSupportedLocales } from '@energinet-datahub/watt/date';
import { WattYearMonthField, YEARMONTH_FORMAT } from '@energinet-datahub/watt/yearmonth-field';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhFormatObservationTimePipe } from './dh-format-observation-time.pipe';
import { AggregatedMeasurements, AggregatedMeasurementsQueryVariables } from '../../types';

@Component({
  selector: 'dh-measurements-month',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_TABLE,
    DecimalPipe,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattYearMonthField,
    VaterUtilityDirective,
    DhFormatObservationTimePipe,
  ],
  styles: `
    :host {
      watt-datepicker {
        width: 200px;
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
        <watt-yearmonth-field [formControl]="yearMonth" [max]="maxDate.toDate()" />
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; read: 'meteringPoint.measurements.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns"
        [stickyFooter]="true"
        [dataSource]="dataSource"
        [loading]="query.loading()"
        sortDirection="desc"
        [sortClear]="false"
      >
        <ng-container *wattTableCell="columns.month; let element">
          {{ element.date | dhFormatObservationTime: Resolution.Day }}
        </ng-container>

        <ng-container *wattTableCell="columns.currentQuantity; let element">
          {{ element.quantity | number: '1.3' }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsMonthComponent {
  private locale = inject<WattSupportedLocales>(LOCALE_ID);
  private transloco = inject(TranslocoService);
  private fb = inject(NonNullableFormBuilder);
  private measurements = computed(() => this.query.data()?.aggregatedMeasurementsForMonth ?? []);
  private sum = computed(
    () => `${this.formatNumber(this.measurements().reduce((acc, x) => acc + x.quantity, 0))}`
  );
  maxDate = dayjs().subtract(1, 'days');
  yearMonth = this.fb.control<string>(this.maxDate.format(YEARMONTH_FORMAT));
  meteringPointId = input.required<string>();
  query = lazyQuery(GetAggregatedMeasurementsForMonthDocument);
  Resolution = Resolution;

  columns: WattTableColumnDef<AggregatedMeasurements> = {
    month: {
      accessor: 'date',
      size: 'min-content',
      footer: { value: signal(this.transloco.translate('meteringPoint.measurements.sum')) },
    },
    currentQuantity: { accessor: 'quantity', align: 'right', footer: { value: this.sum } },
    padding: { accessor: null, size: '1fr', header: '' },
  };

  dataSource = new WattTableDataSource<AggregatedMeasurements>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.query.data()?.aggregatedMeasurementsForMonth ?? [];
    });

    effect(() => {
      const yearMonth = this.values().yearMonth;
      if (!yearMonth) return;

      this.query.refetch({
        query: {
          meteringPointId: this.meteringPointId(),
          yearMonth,
        },
      });
    });
  }

  values = toSignal<AggregatedMeasurementsQueryVariables>(
    this.yearMonth.valueChanges.pipe(
      startWith(null),
      map(() => this.yearMonth.getRawValue()),
      exists(),
      map((yearMonth) => ({
        yearMonth,
      }))
    ),
    { requireSync: true }
  );

  formatNumber(value: number) {
    return formatNumber(value, this.locale, '1.3');
  }
}
