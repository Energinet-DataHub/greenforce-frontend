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
import {
  SendMeasurementsQuality,
  SendMeasurementsResolution,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { danishTimeZoneIdentifier } from '@energinet-datahub/watt/datepicker';

export type Measurement = {
  position: number;
  quantity: number;
  quality: SendMeasurementsQuality;
};

export type MeasureDataParseError = {
  key: string;
  index: number;
};

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
  progress?: number;

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
    const date = dayjs(period, this.DATETIME_FORMATS);
    if (!date.isValid()) return false;
    if (!this.first) this.first = date;
    this.last = date;
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
        return this.last.add(1, 'month');
    }
  };

  /** Gets the current start and end of measurements. WARNING: Slow! */
  maybeGetDateRange = () => {
    const start = this.first?.tz(danishTimeZoneIdentifier, true).toDate();
    const end = this.maybeGetEnd()?.tz(danishTimeZoneIdentifier, true).toDate();
    return start ? { start, end } : null;
  };

  /** Updates the progress of the parser based on the current cursor position. */
  updateProgress = (cursor: number) => {
    this.progress = Math.round(Math.min(cursor / this.fileSize, 1) * 100);
  };

  /** Adds a measurement to the result. */
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
