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
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Component, computed, effect, inject, input, LOCALE_ID, signal } from '@angular/core';

import qs from 'qs';
import { map, startWith } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import {
  Quality,
  Resolution,
  GetAggregatedMeasurementsForMonthDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { getPath, MeasurementsSubPaths } from '@energinet-datahub/dh/core/routing';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { dayjs, WattSupportedLocales } from '@energinet-datahub/watt/date';
import { WattSlideToggleComponent } from '@energinet-datahub/watt/slide-toggle';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';
import { WattYearMonthField, YEARMONTH_FORMAT } from '@energinet-datahub/watt/yearmonth-field';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import {
  AggregatedMeasurementsForMonth,
  AggregatedMeasurementsByMonthQueryVariables,
} from '../../types';

import { DhCircleComponent } from './circle.component';
import { DhFormatObservationTimePipe } from './dh-format-observation-time.pipe';
import { dhFormatMeasurementNumber } from '../../utils/dh-format-measurement-number';

@Component({
  selector: 'dh-measurements-month',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_TABLE,
    WattYearMonthField,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattSlideToggleComponent,
    WattQueryParamsDirective,

    VaterStackComponent,
    VaterUtilityDirective,

    DhCircleComponent,
    DhFormatObservationTimePipe,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;
    :host {
      watt-yearmonth-field {
        width: 280px;
      }

      .missing-values-text {
        @include watt.typography-watt-text-s;
        color: var(--watt-on-light-medium-emphasis);
      }
    }
  `,
  template: `
    <watt-data-table
      [enableSearch]="false"
      [enableCount]="false"
      [error]="query.error()"
      [ready]="query.called()"
      [enablePaginator]="false"
      *transloco="let t; read: 'meteringPoint.measurements'"
    >
      <watt-data-filters *transloco="let t; read: 'meteringPoint.measurements.filters'">
        <form wattQueryParams [formGroup]="form">
          <vater-stack direction="row" gap="ml" align="baseline">
            <watt-yearmonth-field [formControl]="form.controls.yearMonth" canStepThroughMonths />
            <watt-slide-toggle [formControl]="form.controls.showOnlyChangedValues">
              {{ t('showOnlyChangedValues') }}
            </watt-slide-toggle>
          </vater-stack>
        </form>
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
        (rowClick)="navigateToDay($event.date)"
      >
        <ng-container *wattTableCell="columns.date; let element">
          {{ element.date | dhFormatObservationTime: Resolution.Daily }}
        </ng-container>

        <ng-container *wattTableCell="columns.currentQuantity; let element">
          @if (element.qualities.includes(Quality.Estimated)) {
            ≈
          }
          {{ formatNumber(element.quantity) }}
        </ng-container>

        <ng-container *wattTableCell="columns.containsUpdatedValues; let element">
          @if (element.containsUpdatedValues) {
            <dh-circle />
          }
        </ng-container>

        <ng-container *wattTableCell="columns.missingValues; let element">
          @if (element.isMissingValues) {
            <span class="missing-values-text">{{ t('missingValues') }}</span>
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsMonthComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(NonNullableFormBuilder);
  private transloco = inject(TranslocoService);
  private sum = computed(() =>
    this.formatNumber(this.measurements().reduce((acc, x) => acc + x.quantity, 0))
  );
  private locale = inject<WattSupportedLocales>(LOCALE_ID);
  private measurements = computed(() => this.query.data()?.aggregatedMeasurementsForMonth ?? []);
  form = this.fb.group({
    yearMonth: this.fb.control<string>(dayjs().format(YEARMONTH_FORMAT)),
    showOnlyChangedValues: this.fb.control(false),
  });
  meteringPointId = input.required<string>();
  query = lazyQuery(GetAggregatedMeasurementsForMonthDocument);
  Resolution = Resolution;
  Quality = Quality;

  columns: WattTableColumnDef<AggregatedMeasurementsForMonth> = {
    date: {
      accessor: 'date',
      size: 'min-content',
      footer: { value: signal(this.transloco.translate('meteringPoint.measurements.sum')) },
    },
    currentQuantity: {
      accessor: 'quantity',
      align: 'right',
      footer: { value: this.sum },
    },
    containsUpdatedValues: {
      accessor: null,
      header: '',
    },
    missingValues: {
      accessor: null,
      header: '',
      size: '1fr',
    },
  };

  dataSource = new WattTableDataSource<AggregatedMeasurementsForMonth>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.query.data()?.aggregatedMeasurementsForMonth ?? [];
    });

    effect(() =>
      this.query.refetch({
        ...this.values(),
        meteringPointId: this.meteringPointId(),
      })
    );
  }

  values = toSignal<AggregatedMeasurementsByMonthQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(
        ({ yearMonth, showOnlyChangedValues }): AggregatedMeasurementsByMonthQueryVariables => ({
          yearMonth,
          showOnlyChangedValues,
        })
      )
    ),
    { requireSync: true }
  );

  formatNumber(value: number) {
    return dhFormatMeasurementNumber(value, this.locale);
  }

  navigateToDay(date: Date | undefined | null) {
    if (!date) return;

    this.router.navigate(['../', this.getLink('day')], {
      queryParams: { filters: qs.stringify({ date: dayjs(date).format('YYYY-MM-DD') }) },
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }

  private getLink = (key: MeasurementsSubPaths) => getPath<MeasurementsSubPaths>(key);
}
