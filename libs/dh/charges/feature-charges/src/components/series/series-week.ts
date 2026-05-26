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
import {
  input,
  computed,
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WattDataTableComponent, WattDataFiltersComponent } from '@energinet/watt/data';
import { dayjs, WattDatePipe, WattRange } from '@energinet/watt/core/date';
import { dataSource, WATT_TABLE, WattTableColumn, WattTableColumnDef } from '@energinet/watt/table';
import {
  WattDatepickerComponent,
  wattProvideOneWeekRangeSelectionStrategy,
} from '@energinet/watt/datepicker';

import {
  GetChargeByIdDocument,
  GetChargeWeekSeriesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  dhMakeFormControl,
  dhFormControlToSignal,
  DhCircleComponent,
} from '@energinet-datahub/dh/shared/ui-util';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

import { computeRowLabels, groupSeriesByDay } from '../util/week-table-utils';
import { ChargeSeriesPointLite, DhChargesWeekRow } from '../../types';
import { DhChargeIntervalPipe } from '@energinet-datahub/dh/charges/feature-ui-shared';

@Component({
  selector: 'dh-charges-series-week-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    TranslocoDirective,
    TranslocoPipe,

    VATER,
    WATT_TABLE,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WattDatepickerComponent,
    WattDatePipe,
    DhCircleComponent,
  ],
  styles: `
    dh-charges-series-week-table {
      watt-datepicker {
        width: 260px;
      }

      .week-table__weekend-cell {
        background-color: var(--watt-color-neutral-grey-100);
      }
    }
  `,
  providers: [wattProvideOneWeekRangeSelectionStrategy()],
  template: `
    <watt-data-table
      [error]="chargeWeekSeriesQuery.error()"
      [ready]="ready()"
      [enablePaginator]="false"
      [header]="false"
      *transloco="let t; prefix: 'charges.tariff.weekView'"
    >
      <watt-data-filters>
        <vater-stack direction="row" [align]="'center'">
          <form [formGroup]="form">
            <watt-datepicker [formControl]="form.controls.periodControl" range />
          </form>
        </vater-stack>
      </watt-data-filters>

      <watt-table
        [columns]="columns()"
        [dataSource]="dataSource"
        [loading]="chargeWeekSeriesQuery.loading()"
        [stickyFooter]="true"
      >
        @let dateHeader = 'charges.series.resolution.' + (resolution() ?? 'UNKNOWN') | transloco;

        <ng-container *wattTableCell="columns().date; header: dateHeader; let row">
          {{ row.label }}
        </ng-container>

        @for (date of datesWithinPeriod(); track $index; let index = $index) {
          @let _day = 'day' + (index + 1);

          @let dayHeader =
            t('columns.' + _day, {
              date: date | wattDate,
            });

          <ng-container *wattTableCell="columns()[_day]; header: dayHeader; let row">
            @if (row.series[index]) {
              {{ row.series[index].price | number: '1.6-6' }}
            }
          </ng-container>

          <ng-container *wattTableCell="columns()[_day + 'HasChanged']; header: ''; let row">
            @if (row.series[index]?.hasChanged) {
              <dh-circle />
            }
          </ng-container>
        }
      </watt-table>
    </watt-data-table>
  `,
})
export class DhChargesSeriesWeekTable {
  private currentWeek: WattRange<Date> = {
    start: dayjs().startOf('week').toDate(),
    end: dayjs().endOf('week').toDate(),
  };

  protected chargeByIdQuery = query(GetChargeByIdDocument, () => ({
    variables: { id: this.id() },
  }));

  protected chargeWeekSeriesQuery = query(GetChargeWeekSeriesDocument, () => {
    const period = this.selectedPeriod();

    return !period
      ? { skip: true }
      : {
          variables: {
            chargeId: this.id(),
            interval: period,
          },
        };
  });

  form = new FormGroup({
    periodControl: dhMakeFormControl<WattRange<Date> | null>(this.currentWeek),
  });

  private selectedPeriod = dhFormControlToSignal(this.form.controls.periodControl);

  id = input.required<string>();

  ready = computed(() => this.chargeByIdQuery.called() && this.chargeWeekSeriesQuery.called());

  charge = computed(() => this.chargeByIdQuery.data()?.chargeById);
  resolution = computed(() => this.charge()?.resolution);

  series = computed(() => this.chargeWeekSeriesQuery.data()?.chargeById?.series ?? []);
  dataSource = dataSource(() => this.generateRows(this.series()));

  columns = computed<WattTableColumnDef<DhChargesWeekRow>>(() => {
    const columns: WattTableColumnDef<DhChargesWeekRow> = {
      date: { accessor: null, sort: false },
    };

    this.datesWithinPeriod().forEach((_, index) => {
      const dayIndex = index + 1;
      const columnKey = 'day' + dayIndex;
      const isWeekend = dayIndex > 5;

      const dayColumn: WattTableColumn<DhChargesWeekRow> = {
        accessor: null,
        align: 'right',
        size: 'minmax(200px, auto)',
        sort: false,
        dataCellClass: isWeekend ? 'week-table__weekend-cell' : '',
      };
      const dotColumn: WattTableColumn<DhChargesWeekRow> = {
        accessor: null,
        sort: false,
        dataCellClass: isWeekend ? 'week-table__weekend-cell' : '',
      };

      columns[columnKey] = dayColumn;
      columns[columnKey + 'HasChanged'] = dotColumn;
    });

    return columns;
  });

  datesWithinPeriod = computed(() => {
    const period = this.selectedPeriod();

    if (!period) {
      return [];
    }

    const periodStart = dayjs(period.start);
    const periodEnd = dayjs(period.end);
    const diff = periodEnd.diff(periodStart, 'day');

    return Array.from({ length: diff + 1 }, (_, index) => periodStart.add(index, 'day').toDate());
  });

  private generateRows(apiSeries: ChargeSeriesPointLite[]): DhChargesWeekRow[] {
    const period = this.selectedPeriod();

    if (this.chargeWeekSeriesQuery.loading() || !period) {
      return [];
    }

    assertIsDefined(period.end);

    const rowLabels = computeRowLabels(period.start, period.end);
    const apiSeriesMap = groupSeriesByDay(apiSeries);

    const emptySlot: DhChargesWeekRow['series'][0] = { price: null, hasChanged: false };
    const pipe = new DhChargeIntervalPipe();

    return rowLabels.map((label) => {
      return {
        label,
        series: this.datesWithinPeriod().map((date) => {
          const dayKey = dayjs(date).startOf('day').toISOString();
          const points = apiSeriesMap[dayKey] ?? [];

          const maybePoint = points.find((p) => {
            const range = {
              start: p.interval.start,
              end: p.interval.end ?? null,
            };

            const intervalLabel = pipe.transform(range, 'HOURLY');

            return intervalLabel === label;
          });

          return maybePoint
            ? { price: maybePoint.price, hasChanged: maybePoint.hasChanged }
            : emptySlot;
        }),
      };
    });
  }
}
