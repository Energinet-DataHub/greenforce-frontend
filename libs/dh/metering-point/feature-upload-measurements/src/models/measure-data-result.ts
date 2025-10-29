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
import {
  SendMeasurementsQuality,
  SendMeasurementsResolution,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { danishTimeZoneIdentifier } from '@energinet/watt/datepicker';

export type Measurement = {
  position: number;
  quantity: number;
  quality: SendMeasurementsQuality;
};

export type MeasureDataParseError = {
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

export class MeasureDataResult {
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

  /** Date of the first measurement. */
  first?: dayjs.Dayjs;

  /** Date of the last measurement. */
  last?: dayjs.Dayjs;

  /** Total sum of all measurements. */
  sum = 0;

  /** Progress of the parsing process. */
  progress = 0;

  /** Current row index. */
  index = 0;

  /** Whether the parsing process has encountered a fatal error. */
  isFatal = false;

  /** Set of qualities associated with the measurements. */
  qualities = new Set<SendMeasurementsQuality>();

  /** Array of measurements parsed from the CSV file. */
  measurements: Measurement[] = [];

  /** Array of errors encountered during parsing. */
  errors: MeasureDataParseError[] = [];

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
    // When parsing a Date from the measurements CSV, specifically around DST boundaries,
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

  /** Returns the end date of all measurements or `null` if there no measurements. */
  maybeGetEnd = () => {
    if (!this.last) return null;
    switch (this.resolution) {
      case SendMeasurementsResolution.QuarterHourly:
        return this.last.add(15, 'minutes');
      case SendMeasurementsResolution.Hourly:
        return this.last.add(1, 'hour');
      case SendMeasurementsResolution.Monthly:
        // HACK: dayjs does not add days correctly across DST boundaries
        // https://github.com/iamkun/dayjs/issues/1271
        return this.last
          .tz(danishTimeZoneIdentifier)
          .add(1, 'month')
          .tz(danishTimeZoneIdentifier, true)
          .utc();
    }
  };

  /** Gets the current start and end of measurements. */
  maybeGetDateRange = () => {
    const start = this.first?.toDate();
    const end = this.maybeGetEnd()?.toDate();
    return start ? { start, end } : null;
  };

  /** Updates the progress of the parser based on the current cursor position. */
  updateProgress = (cursor: number) => {
    this.progress = Math.round(Math.min(cursor / this.fileSize, 1) * 100);
  };

  /** Adds a measurement to the result. Chainable. */
  addMeasurement = (measurement: Measurement) => {
    this.measurements.push(measurement);
    this.sum += measurement.quantity;
    this.qualities.add(measurement.quality);
    return this;
  };

  constructor(
    private fileSize: number,
    public resolution: SendMeasurementsResolution
  ) {}
}
