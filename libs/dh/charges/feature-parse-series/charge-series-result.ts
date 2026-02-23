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
import { dayjs } from '@energinet/watt/date';
import { ChargePointV2Input, ChargeResolution } from '@energinet-datahub/dh/shared/domain/graphql';
import { danishTimeZoneIdentifier } from '@energinet/watt/datepicker';

export type ChargeSeriesParseError = {
  key: string;
  index: number;
};

const dateFormatInZone = new Intl.DateTimeFormat('da-DK', {
  timeZone: 'Europe/Copenhagen',
  dateStyle: 'short',
  timeStyle: 'short',
});

const dateFormat = new Intl.DateTimeFormat('da-DK', {
  timeZone: 'UTC',
  dateStyle: 'short',
  timeStyle: 'short',
});

/**
 * Applies a transformation to a Day.js date with proper DST handling.
 * The transform function receives the date in Danish timezone and can chain any operations.
 */
function withDstFix(date: dayjs.Dayjs, transform: (d: dayjs.Dayjs) => dayjs.Dayjs): dayjs.Dayjs {
  // HACK: dayjs does not add days/months correctly across DST boundaries
  // https://github.com/iamkun/dayjs/issues/1271
  return transform(date.tz(danishTimeZoneIdentifier)).tz(danishTimeZoneIdentifier, true).utc();
}

export class ChargeSeriesResult {
  // List of supported date time formats
  private readonly DATETIME_FORMATS = [
    'D.M.YYYY H.mm', // 28.4.2025 0.00
    'DD.MM.YYYY H.mm', // 28.04.2025 0.00
    'YYYY-MM-DD H.mm', // 2025-04-28 0.15
    'YYYY-M-D H.mm', // 2025-4-28 0.15
    'D.M.YYYY HH.mm', // 28.4.2025 00.00
    'DD.MM.YYYY HH.mm', // 28.04.2025 00.00
    'YYYY-MM-DD HH.mm', // 2025-04-28 00.15
  ];

  /** Date of the first point. */
  first?: dayjs.Dayjs;

  /** Date of the last point. */
  last?: dayjs.Dayjs;

  /** Progress of the parsing process. */
  progress = 0;

  /** Current row index. */
  index = 0;

  /** Whether the parsing process has encountered a fatal error. */
  isFatal = false;

  /** Array of points parsed from the CSV file. */
  points: ChargePointV2Input[] = [];

  /** Array of errors encountered during parsing. */
  errors: ChargeSeriesParseError[] = [];

  /** Sets the progress to 100%. Chainable. */
  done = () => ((this.progress = 100), this);

  /** Adds an error to the list of errors. Chainable. */
  error = (key: string) => (this.errors.push({ key, index: this.index }), this);

  /** Marks the result as fatal and adds an error to the list of errors. Chainable. */
  fatal = (key: string) => ((this.isFatal = true), this.error(key));

  /** Try to set the current period, returns false if date is invalid. */
  trySetPeriod(period: string) {
    // Parse in local time, since `tz` is VERY slow.
    const date = dayjs(period, this.DATETIME_FORMATS);
    if (!date.isValid()) return false;

    // Correct the offset by keeping local time, adjusting the offset instead. Then save in UTC.
    const toZoned = () => date.tz(danishTimeZoneIdentifier, true).utc();
    if (!this.first) this.first = toZoned();

    // Adjust for DST
    // ----------------------------------------------------------------------------------------
    // When parsing a Date from the charge series CSV, specifically around DST boundaries,
    // the actual time can be ambiguous and can only be determined by looking at prior entries.
    // To parse this correctly requires a series of steps outlined below. Due to numerous bugs
    // found in Dayjs related to DST, the code uses `Intl` instead of utilities from Dayjs.
    // ----------------------------------------------------------------------------------------

    // Get the Date that `period` is supposed to parse to (if the data is correct). When parsing a
    // period within the DST transition, this Date may be different from the parsed Date, even when
    // the data is correct. BUT the dates will be equal when formatted (without offset), so this
    // can be used to adjust the period.
    const end = this.maybeGetEnd();
    if (!end) {
      this.last = toZoned();
    } else {
      // The end Date (which is in UTC) is formatted to a danish format, adjusting the hours
      // appropriately (fx. "2025-10-26T00:00:00.000Z" becomes "26.10.2025, 02.00").
      const expected = dateFormatInZone.format(end.toDate());

      // Remove the offset from the parsed Date (which can be in any local time), converting it
      // to UTC (fx. "2025-10-26T02:00:00.000+02:00" becomes "2025-10-26T02:00:00.000Z"). The Date
      // is now certainly wrong, but that is intentional. It can now be formatted similar to above,
      // but without timezone adjustment. The same example should then become "26.10.2025, 02.00".
      const actual = dateFormat.format(date.utc(true).toDate());

      // Finally, if the textual representations of the expected Date and the actual parsed Date
      // are equal, then correct the parsed date to be the same as the expected Date (end).
      this.last = expected === actual ? end : toZoned();
    }

    return true;
  }

  /** Returns the end date of all points or `null` if there are no points. */
  maybeGetEnd = () => {
    if (!this.last) return null;
    switch (this.resolution) {
      case ChargeResolution.QuarterHourly:
        return this.last.add(15, 'minutes');
      case ChargeResolution.Hourly:
        return this.last.add(1, 'hour');
      case ChargeResolution.Daily:
        return withDstFix(this.last, (d) => d.add(1, 'day'));
      case ChargeResolution.Monthly:
        // For monthly resolution, the first entry can start on any day of the month.
        // Subsequent entries must start on the 1st of the month.
        return this.points.length === 1
          ? withDstFix(this.last, (d) => d.add(1, 'month').startOf('month'))
          : withDstFix(this.last, (d) => d.add(1, 'month'));
    }
  };

  /** Gets the current start and end of points. */
  maybeGetDateRange = () => {
    const start = this.first?.toDate();
    const end = this.maybeGetEnd()?.toDate();
    return start ? { start, end } : null;
  };

  /** Updates the progress of the parser based on the current cursor position. */
  updateProgress = (cursor: number) => {
    this.progress = Math.round(Math.min(cursor / this.fileSize, 1) * 100);
  };

  /** Adds a point to the result. Chainable. */
  addPoint = (point: ChargePointV2Input) => {
    this.points.push(point);
    return this;
  };

  constructor(
    private fileSize: number,
    public resolution: ChargeResolution
  ) {}
}
