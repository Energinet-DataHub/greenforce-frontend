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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  viewChild,
} from '@angular/core';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { dayjs } from '@energinet/watt/date';
import { WattYearField, YEAR_FORMAT } from '@energinet/watt/year-field';
import { WattYearMonthField, YEARMONTH_FORMAT } from '@energinet/watt/yearmonth-field';
import { WattDatepickerComponent, danishTimeZoneIdentifier } from '@energinet/watt/datepicker';

import { ChargeResolution } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-charges-interval-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, WattDatepickerComponent, WattYearField, WattYearMonthField],
  host: {
    class: 'watt-field--compact',
  },
  template: `
    @switch (resolution()) {
      @case ('DAILY') {
        <watt-yearmonth-field [formControl]="formGroup.controls.yearMonth" canStepThroughMonths />
      }
      @case ('MONTHLY') {
        <watt-year-field [formControl]="formGroup.controls.year" canStepThroughYears />
      }
      @default {
        <watt-datepicker [formControl]="formGroup.controls.date" canStepThroughDays />
      }
    }
  `,
})
export class DhChargesIntervalField {
  readonly resolution = input<ChargeResolution>();
  readonly date = model.required<Date>();
  private value = computed(() => {
    const date = this.date();
    switch (this.resolution()) {
      case 'DAILY':
        return dayjs(date).format(YEARMONTH_FORMAT);
      case 'MONTHLY':
        return dayjs(date).format(YEAR_FORMAT);
      default:
        return dayjs(date).toISOString();
    }
  });

  private datepicker = viewChild(WattDatepickerComponent);
  protected formGroup = new FormGroup({
    date: dhMakeFormControl<string>(),
    yearMonth: dhMakeFormControl<string>(),
    year: dhMakeFormControl<string>(),
  });

  // Two-way binding
  constructor() {
    effect(() => {
      const value = this.value();
      switch (this.resolution()) {
        case 'DAILY':
          this.formGroup.controls.yearMonth.setValue(value);
          break;
        case 'MONTHLY':
          this.formGroup.controls.year.setValue(value);
          break;
        default:
          this.formGroup.controls.date.setValue(value);
          this.datepicker()?.selectDate(dayjs(value).toDate());
          break;
      }
    });

    this.formGroup.valueChanges
      .pipe(
        takeUntilDestroyed(),
        map((form) => {
          switch (this.resolution()) {
            case 'DAILY':
              return dayjs.tz(form.yearMonth, YEARMONTH_FORMAT, danishTimeZoneIdentifier).toDate();
            case 'MONTHLY':
              return dayjs.tz(form.year, YEAR_FORMAT, danishTimeZoneIdentifier).toDate();
            default:
              return dayjs(form.date).startOf('day').toDate();
          }
        })
      )
      .subscribe((date) => this.date.set(date));
  }
}
