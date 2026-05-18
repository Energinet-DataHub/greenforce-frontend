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
import { dayjs, WattRange } from '@energinet/watt/core/date';

/**
 * Determines if the selected week includes the start of daylight saving time (DST). This is done by comparing the UTC offset of the last day of the interval with the UTC offset of the day before. If the day before has a smaller UTC offset, it means that DST starts during that week.
 */
export function isDstStartWeek(period: WattRange<Date> | null): boolean {
  if (!period) {
    return false;
  }

  const dayBeforeEndDateUtcOffset = dayjs(period.end).subtract(1, 'day').utcOffset();
  const endDateUtcOffset = dayjs(period.end).utcOffset();

  return dayBeforeEndDateUtcOffset < endDateUtcOffset;
}

/**
 * Determines if the selected week includes the end of daylight saving time (DST). This is done by comparing the UTC offset of the last day of the interval with the UTC offset of the day before. If the day before has a greater UTC offset, it means that DST ends during that week.
 */
export function isDstEndWeek(period: WattRange<Date> | null): boolean {
  if (!period) {
    return false;
  }

  const dayBeforeEndDateUtcOffset = dayjs(period.end).subtract(1, 'day').utcOffset();
  const endDateUtcOffset = dayjs(period.end).utcOffset();

  return dayBeforeEndDateUtcOffset > endDateUtcOffset;
}

/**
 * Computes the time interval for a given row index in the week table, taking DST into account.
 */
export function computeRowInterval(
  currentRowIndex: number,
  isDstStartWeek: boolean,
  isDstEndWeek: boolean,
  periodStart: Date,
  periodEnd: Date | null,
  dstRowIndex: number
): { start: Date; end: Date } {
  const intervalStart = dayjs(periodStart).startOf('day');
  const intervalEnd = dayjs(periodEnd).startOf('day');

  if (isDstStartWeek) {
    if (currentRowIndex < dstRowIndex) {
      const start = intervalStart.hour(currentRowIndex);

      return { start: start.toDate(), end: start.hour(currentRowIndex + 1).toDate() };
    }

    if (currentRowIndex === dstRowIndex) {
      const hour = intervalEnd.hour(1);

      return { start: hour.toDate(), end: hour.add(1, 'hour').toDate() };
    }

    const start = intervalStart.hour(currentRowIndex - 1);

    return { start: start.toDate(), end: start.hour(currentRowIndex).toDate() };
  }

  if (isDstEndWeek) {
    if (currentRowIndex < dstRowIndex) {
      const start = intervalStart.hour(currentRowIndex);

      return { start: start.toDate(), end: start.hour(currentRowIndex + 1).toDate() };
    }

    if (currentRowIndex === dstRowIndex) {
      const hour = intervalEnd.hour(2);

      return { start: hour.toDate(), end: hour.add(1, 'hour').toDate() };
    }

    const start = intervalStart.hour(currentRowIndex - 1);

    return { start: start.toDate(), end: start.hour(currentRowIndex).toDate() };
  }

  const start = intervalStart.hour(currentRowIndex);

  return { start: start.toDate(), end: start.hour(currentRowIndex + 1).toDate() };
}
