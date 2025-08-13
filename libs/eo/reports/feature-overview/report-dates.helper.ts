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
import { dayjs } from '@energinet-datahub/watt/date';
import { TranslocoService } from '@jsverse/transloco';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
export const thisYear = dayjs().locale('da').year();
export const lastWeekNumberAsString = dayjs().subtract(1, 'week').isoWeek().toString();
export const lastMonthNameInEnglish = dayjs()
  .locale('en')
  .subtract(1, 'month')
  .format('MMMM')
  .toLowerCase();
export const lastYear = dayjs().subtract(1, 'year').locale('da').year();
export const lastYearAsString = dayjs().subtract(1, 'year').locale('da').format('YYYY');
export const customDateRangeStartDate = dayjs()
  .subtract(7, 'days')
  .subtract(1, 'year')
  .toISOString();
export const customDateRangeEndDate = dayjs().subtract(7, 'days').toISOString();
export const months: string[] = [
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
export const maxDate = dayjs().subtract(7, 'days').locale('da').toDate();

export function getWeekDropDownOptions(year: number): WattDropdownOptions {
  const yearDate = dayjs().year(year).locale('da');
  const weeksInYear = yearDate.isoWeeksInYear();

  if (year >= thisYear) {
    return Array.from({ length: dayjs().week() - 1 }, (_, index) => {
      const displayWeekNumber = (index + 1).toString();
      return {
        value: displayWeekNumber,
        displayValue: displayWeekNumber,
      };
    });
  } else {
    return Array.from({ length: weeksInYear }, (_, index) => {
      const displayWeekNumber = (index + 1).toString();
      return {
        value: displayWeekNumber,
        displayValue: displayWeekNumber,
      };
    });
  }
}

export function getMonthDropDownOptions(
  year: number,
  transloco: TranslocoService
): WattDropdownOptions {
  if (year >= thisYear) {
    return Array.from({ length: dayjs().month() }, (_, index) => {
      const monthKey = months[index];
      return {
        value: monthKey,
        displayValue: transloco.translate(`months.${monthKey}`),
      };
    });
  } else {
    return Array.from({ length: 12 }, (_, index) => {
      const monthKey = months[index];
      return {
        value: monthKey,
        displayValue: transloco.translate(`months.${monthKey}`),
      };
    });
  }
}

export function getYearDropDownOptions(): WattDropdownOptions {
  const currentYear = dayjs().year();
  return Array.from({ length: 3 }, (_, index) => {
    const year = String(currentYear - index);
    return {
      value: year,
      displayValue: year,
    };
  });
}

export function getFinancialYearDropDownOptions(): WattDropdownOptions {
  const isPast1stOfApril = dayjs().isAfter(dayjs().month(3).date(1));
  let startYear = dayjs().year();
  if (!isPast1stOfApril) {
    startYear = startYear - 1;
  }
  return Array.from({ length: 3 }, (_, index) => {
    const year = String(startYear - index);
    return {
      value: year,
      displayValue: year,
    };
  });
}

export function rangeIsMoreThanAYear(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = dayjs(control.value.start);
    const endDate = dayjs(control.value.end);

    const differenceInDays = endDate.diff(startDate, 'day');

    if (differenceInDays > 365) {
      return { rangeTooLong: true };
    } else {
      return null;
    }
  };
}

export function getMonthFromName(monthName: string): number {
  return months.indexOf(monthName.toLowerCase());
}

export function getWeekRange(week: string, year: string): EoReportDateRange {
  const weekNumber = parseInt(week, 10);
  console.log('weekNumber', weekNumber);
  const yearNumber = parseInt(year, 10);
  console.log('dayjs now', dayjs().locale('da'));
  const firstDayOfWeek = dayjs().locale('da').year(yearNumber).week(weekNumber).startOf('week');
  console.log('firstDayOfWeek', firstDayOfWeek);
  const firstDayOfNextWeek = firstDayOfWeek.add(1, 'week');
  console.log('firstDayOfNextWeek', firstDayOfNextWeek);

  return {
    startDate: firstDayOfWeek.valueOf(),
    endDate: Math.min(firstDayOfNextWeek.valueOf(), dayjs().locale('da').valueOf()),
  };
}

export function getMonthRange(monthName: string, year: string): EoReportDateRange {
  const monthNumber = getMonthFromName(monthName);
  const yearNumber = parseInt(year, 10) ?? '';
  let dateFromMonth = dayjs().year(yearNumber).month(monthNumber);

  if (dateFromMonth.isAfter(today)) {
    dateFromMonth = dateFromMonth.subtract(1, 'year');
  }

  const firstDayOfMonth = dateFromMonth.startOf('month').locale('da');
  const firstDayOfNextMonth = firstDayOfMonth.add(1, 'month');

  return {
    startDate: firstDayOfMonth.valueOf(),
    endDate: Math.min(firstDayOfNextMonth.valueOf(), dayjs().locale('da').valueOf()),
  };
}

export function getYearRange(year: string): EoReportDateRange {
  const yearAsNumber = parseInt(year, 10);

  const startOfYear = dayjs().year(yearAsNumber).startOf('year').locale('da');
  const startOfNextYear = startOfYear.add(1, 'year');

  return {
    startDate: startOfYear.valueOf(),
    endDate: Math.min(startOfNextYear.valueOf(), dayjs().locale('da').valueOf()),
  };
}

export function getFinancialYearRange(year: string): EoReportDateRange {
  const yearAsNumber = parseInt(year, 10);

  const startOfFinancialYear = dayjs().year(yearAsNumber).month(4).startOf('month').locale('da');
  const startOfNextFinancialYear = startOfFinancialYear.add(1, 'year');

  return {
    startDate: startOfFinancialYear.valueOf(),
    endDate: Math.min(startOfNextFinancialYear.valueOf(), dayjs().locale('da').valueOf()),
  };
}
