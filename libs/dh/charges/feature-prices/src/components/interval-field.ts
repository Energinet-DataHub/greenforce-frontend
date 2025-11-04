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
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChargeResolution } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhFormToSignal, dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { dayjs } from '@energinet/watt/date';
import { WattDatepickerComponent, danishTimeZoneIdentifier } from '@energinet/watt/datepicker';
import { WattYearField, YEAR_FORMAT } from '@energinet/watt/year-field';
import { WattYearMonthField, YEARMONTH_FORMAT } from '@energinet/watt/yearmonth-field';

@Component({
  selector: 'dh-charges-interval-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, WattDatepickerComponent, WattYearField, WattYearMonthField],
  template: `
    @switch (resolution()) {
      @case ('Daily') {
        <watt-yearmonth-field [formControl]="form.controls.yearMonth" />
      }
      @case ('Monthly') {
        <watt-year-field [formControl]="form.controls.year" />
      }
      @default {
        <watt-datepicker [formControl]="form.controls.date" />
      }
    }
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhChargesIntervalField {
  readonly resolution = input.required<ChargeResolution>();
  protected form = new FormGroup({
    date: dhMakeFormControl<string>(dayjs().toISOString()),
    yearMonth: dhMakeFormControl<string>(dayjs().format(YEARMONTH_FORMAT)),
    year: dhMakeFormControl<string>(dayjs().format(YEAR_FORMAT)),
  });

  private value = dhFormToSignal(this.form, true);
  private interval = computed(() => {
    const value = this.value();
    switch (this.resolution()) {
      case 'Daily': {
        const date = dayjs.tz(value.yearMonth, YEARMONTH_FORMAT, danishTimeZoneIdentifier);
        return { start: date.toDate(), end: date.endOf('month').toDate() };
      }
      case 'Monthly': {
        const date = dayjs.tz(value.year, YEAR_FORMAT, danishTimeZoneIdentifier);
        return { start: date.toDate(), end: date.endOf('year').toDate() };
      }
      default: {
        const date = dayjs.tz(value.date, danishTimeZoneIdentifier);
        return { start: date.toDate(), end: date.endOf('day').toDate() };
      }
    }
  });

  readonly intervalChange = outputFromObservable(toObservable(this.interval));
}
