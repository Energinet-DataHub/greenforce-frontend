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
import { inject } from '@angular/core';
import { dayjs } from '@energinet-datahub/watt/date';
import isoWeek from 'dayjs/plugin/isoWeek';
import { TranslocoService } from '@jsverse/transloco';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
dayjs.extend(isoWeek);

export const today = dayjs().toDate();
const currentWeek = dayjs().isoWeek();
const weeksInYear = 52;

export const lastWeek = dayjs().subtract(1, 'week').isoWeek();
export const lastMonth = dayjs().locale('en').subtract(1, 'month');
export const lastYear = dayjs().subtract(1, 'year');

export const firstDayOfLastYear = dayjs().subtract(1, 'year').startOf('year').toDate();
export const lastDayOfLastYear = dayjs().subtract(1, 'year').endOf('year').toDate();

export const weekDropDownOptions: WattDropdownOptions = Array.from(
  { length: weeksInYear },
  (_, index) => ({
    value: String(index + 1),
    displayValue: String(index + 1)
  })
).slice(0, currentWeek);

export function getMonthDropDownOptions(): WattDropdownOptions {
  const transloco = inject(TranslocoService);

  return Array.from({ length: 12 }, (_, index) => {
    const monthKey = dayjs().locale('en').month(index).format('MMMM').toLowerCase();
    return {
      value: monthKey,
      displayValue: transloco.translate(`months.${monthKey}`)
    };
  });
}

export function getYearDropDownOptions(): WattDropdownOptions {
  const currentYear = dayjs().year();
  return Array.from({ length: 5 }, (_, index) => {
    const year = String(currentYear - index);
    return {
      value: year,
      displayValue: year
    };
  });
}

export function startDateCannotBeAfterEndDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (!startDate || !endDate) return null;

    return dayjs(startDate).isAfter(dayjs(endDate)) ? { dateRange: true } : null;
  };
}
