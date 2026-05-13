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
import { input, computed, Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WattDataTableComponent, WattDataFiltersComponent } from '@energinet/watt/data';
import { dayjs, WattRange } from '@energinet/watt/core/date';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import {
  WattDatepickerComponent,
  wattProvideOneWeekRangeSelectionStrategy,
} from '@energinet/watt/datepicker';

import {
  GetChargeByIdDocument,
  GetChargeWeekSeriesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { DhChargeIntervalPipe } from '@energinet-datahub/dh/charges/feature-ui-shared';

import { DhChargesWeekRow } from '../../types';

@Component({
  selector: 'dh-charges-series-week-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    TranslocoPipe,

    VATER,
    WATT_TABLE,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WattDatepickerComponent,
    DhChargeIntervalPipe,
  ],
  styles: `
    watt-datepicker {
      width: 260px;
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
        [columns]="columns"
        [dataSource]="dataSource"
        [loading]="chargeWeekSeriesQuery.loading()"
        [stickyFooter]="true"
      >
        @let dateHeader = 'charges.series.resolution.' + (resolution() ?? 'UNKNOWN') | transloco;

        <ng-container *wattTableCell="columns.date; header: dateHeader; let row">
          {{ row.interval | dhChargeInterval: resolution() }}
        </ng-container>
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
            interval: period.interval,
          },
        };
  });

  form = new FormGroup({
    periodControl: dhMakeFormControl<WattRange<Date>>(this.currentWeek),
  });

  protected selectedPeriod = toSignal(
    this.form.controls.periodControl.valueChanges.pipe(
      filter(Boolean),
      map((interval) => ({
        interval: {
          start: dayjs(interval.start).toDate(),
          end: dayjs(interval.end).toDate(),
        },
      }))
    )
  );

  id = input.required<string>();

  ready = computed(() => this.chargeByIdQuery.called() && this.chargeWeekSeriesQuery.called());

  charge = computed(() => this.chargeByIdQuery.data()?.chargeById);
  resolution = computed(() => this.charge()?.resolution);

  series = computed(() => {
    return [];
  });

  dataSource = dataSource(() => this.series());

  columns: WattTableColumnDef<DhChargesWeekRow> = {
    date: { accessor: null, sort: false },
  };
}
