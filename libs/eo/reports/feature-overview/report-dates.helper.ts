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
import { TranslocoService } from '@jsverse/transloco';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import week from 'dayjs/plugin/weekOfYear';
import { EoReportDateRange } from './eo-start-report-generation.modal.component';

dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(week);

export const today = dayjs().locale('da').toDate();
const currentWeek = dayjs().locale('da').isoWeek();

export const lastWeekNumberAsString = dayjs().subtract(1, 'week').isoWeek().toString();
export const lastMonthNameInEnglish = dayjs().locale('en').subtract(1, 'month').format('MMMM').toLowerCase();
export const lastYearAsString = dayjs().subtract(1, 'year').format('YYYY');

export const firstDayOfLastYear = dayjs().subtract(1, 'year').startOf('year').toDate();
export const lastDayOfLastYear = dayjs().subtract(1, 'year').endOf('year').toDate();

export function getWeekDropDownOptions(): WattDropdownOptions {
  const today = dayjs();
  const currentYear = today.year();
  const lastYear = currentYear - 1;
  const weeksInCurrentYear = today.isoWeeksInYear();
  const weeksInLastYear = today.subtract(1, 'year').isoWeeksInYear();

  return Array.from({ length: weeksInCurrentYear }, (_, index) => {
    let weekNumber = currentWeek - index;
    let year = currentYear;

    if (weekNumber < 1) {
      weekNumber = weeksInLastYear + weekNumber;
      year = lastYear;
    }

    return {
      value: weekNumber.toString(),
      displayValue: `${weekNumber} (${year})`,
    };
  });
}

export function getMonthDropDownOptions(): WattDropdownOptions {
  const transloco = inject(TranslocoService);
  const today = dayjs();

  return Array.from({ length: 12 }, (_, index) => {
    const date = today.subtract(index, 'month');
    const monthKey = date.locale('en').format('MMMM').toLowerCase();
    const year = date.year();

    return {
      value: monthKey,
      displayValue: `${transloco.translate(`months.${monthKey}`)} ${year}`,
    };
  });
}

export function getYearDropDownOptions(): WattDropdownOptions {
  const currentYear = dayjs().year();
  return Array.from({ length: 5 }, (_, index) => {
    const year = String(currentYear - index);
    return {
      value: year,
      displayValue: year,
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

export function getMonthFromName(monthName: string): number {
  const months: string[] = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  return months.indexOf(monthName.toLowerCase());
}

export function getWeekRange(week: string): EoReportDateRange {
  const weekNumber = parseInt(week, 10);
  const firstDayOfWeek = dayjs().week(weekNumber).startOf('week').locale('da');
  const lastDayOfWeek = dayjs().week(weekNumber).endOf('week').locale('da');

  return {
    startDate: firstDayOfWeek.valueOf(),
    endDate: Math.min(lastDayOfWeek.valueOf(), dayjs().locale('da').valueOf()),
  };
}

export function getMonthRange(monthName: string): EoReportDateRange {
  const monthNumber = getMonthFromName(monthName);
  let dateFromMonth = dayjs().month(monthNumber);

  if (dateFromMonth.isAfter(today)) {
    dateFromMonth = dateFromMonth.subtract(1, 'year');
  }

  const firstDayOfMonth = dateFromMonth.startOf('month').locale('da');
  const lastDayOfMonth = dateFromMonth.endOf('month').locale('da');

  return {
    startDate: firstDayOfMonth.valueOf(),
    endDate: Math.min(lastDayOfMonth.valueOf(), dayjs().locale('da').valueOf()),
  };
}

export function getYearRange(year: string): EoReportDateRange {
  const yearAsNumber = parseInt(year, 10);

  const startOfYear = dayjs().year(yearAsNumber).startOf('year').locale('da');
  const endOfYear = dayjs().year(yearAsNumber).endOf('year').locale('da');

  return {
    startDate: startOfYear.valueOf(),
    endDate: Math.min(endOfYear.valueOf(), dayjs().locale('da').valueOf()),
  };
}
