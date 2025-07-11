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
import { Injectable } from '@angular/core';
import { Observable, of, scan, switchMap } from 'rxjs';
import * as Papa from 'papaparse';
import chardet from 'chardet';
import { dayjs } from '@energinet-datahub/watt/date';

import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import {
  SendMeasurementsQuality,
  SendMeasurementsResolution,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { validateKvantumStatus, isMeasurementsCSV, VALID_KVANTUM_STATUS } from './validations';
import { danishTimeZoneIdentifier } from '@energinet-datahub/watt/datepicker'; // EUGH, datepicker??

const POSITION = 'Position';
const VALUE = 'Værdi';
const PERIOD = 'Periode';
const STATUS = 'Kvantum status';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

type ParseStep =
  | { kind: 'completed' }
  | { kind: 'step'; row: Papa.ParseStepResult<Record<string, string>> };

type Measurement = {
  position: number;
  quantity: number;
  quality: SendMeasurementsQuality;
};

type MeasureDataParseError = {
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

  constructor(
    private fileSize: number,
    private resolution: SendMeasurementsResolution
  ) {}

  trySetPeriod(period: string) {
    const date = dayjs(period, this.DATETIME_FORMATS); //.tz(danishTimeZoneIdentifier, true);
    if (!date.isValid()) return false;
    if (!this.first) this.first = date;
    if (!this.validateResolution(date)) this.error('CSV_ERROR_INCOMPLETE_DAY'); // TODO: DAY?
    this.last = date;
    return true;
  }

  validateResolution = (date: dayjs.Dayjs) => {
    if (!this.last) return true;
    switch (this.resolution) {
      case SendMeasurementsResolution.QuarterHourly:
        return (date.unix() - this.last.unix()) / 60 === 15;
      case SendMeasurementsResolution.Hourly:
        return (date.unix() - this.last.unix()) / 60 === 60;
      case SendMeasurementsResolution.Monthly:
        return this.last.add(1, 'month').isSame(date);
    }
  };

  // TODO: Consider using this.last.add(15, 'minutes').isSame() instead

  updateProgress = (cursor: number) => {
    this.progress = Math.round((cursor / this.fileSize) * 100);
  };

  done = () => ((this.progress = 100), this);
  error = (key: string) => (this.errors.push({ key, index: this.index }), this);
  fatal = (key: string) => ((this.isFatal = true), this.error(key));

  addMeasurement = (measurement: Measurement) => {
    this.measurements.push(measurement);
    this.sum += measurement.quantity;
    this.qualities.add(measurement.quality);
    return this;
  };

  toInput = () => {
    if (this.errors.length) throw new Error('CSV parsing failed');
    assertIsDefined(this.first);
    assertIsDefined(this.last);

    // TODO: Temp
    let end = this.last;
    switch (this.resolution) {
      case SendMeasurementsResolution.QuarterHourly:
        end = end.add(15, 'minutes').tz(danishTimeZoneIdentifier, true);
        break;
      case SendMeasurementsResolution.Hourly:
        end = end.add(1, 'hour').tz(danishTimeZoneIdentifier, true);
        break;
      case SendMeasurementsResolution.Monthly:
        end = end.add(1, 'month').tz(danishTimeZoneIdentifier, true);
        break;
    }

    return {
      start: this.first.tz(danishTimeZoneIdentifier, true).toDate(),
      end: end.toDate(),
      measurements: this.measurements,
    };
  };
}

@Injectable({ providedIn: 'root' })
export class CsvParseService {
  /** Try to detect the encoding of the file, falling back to `utf-8`. */
  private detectEncoding = async (file: File) =>
    chardet.detect(new Uint8Array(await file.slice(0, 1000).arrayBuffer())) ?? 'utf-8';

  /** Stream the CSV file as a sequence of rows. */
  private streamCsv = (file: File) => (encoding: string) =>
    new Observable<ParseStep>((observer) => {
      let teardown = noop;
      Papa.parse<Record<string, string>>(file, {
        encoding,
        skipEmptyLines: true,
        chunkSize: 20_000,
        header: true,
        // https://github.com/mholt/PapaParse/issues/761
        // worker: true,
        transform: (row, header) => (header === VALUE ? row.replace(',', '.') : row).trim(),
        dynamicTyping: {
          [POSITION]: true,
          [VALUE]: true,
        },
        complete: () => {
          observer.next({ kind: 'completed' });
          observer.complete();
        },
        error: (error) => observer.error(error),
        step: (row, parser) => {
          teardown = parser.abort;
          observer.next({ kind: 'step', row });
        },
      });
      return () => teardown();
    });

  private mapToSendMeasurementsQuality(quality: VALID_KVANTUM_STATUS): SendMeasurementsQuality {
    switch (quality) {
      case 'A03':
      case 'M��lt': // Fix chunk splitting error: https://github.com/mholt/PapaParse/pull/1099
      case 'Målt':
        return SendMeasurementsQuality.Measured;
      case 'A04':
      case 'Estimeret':
        return SendMeasurementsQuality.Estimated;
    }
  }

  /** Aggregate parsed CSV data into a MeasureDataResult. */
  private aggregate = (result: MeasureDataResult, step: ParseStep, index: number) => {
    if (step.kind === 'completed') return result.done();
    result.updateProgress(step.row.meta.cursor);
    result.index = index;

    switch (true) {
      case isMeasurementsCSV(step.row.data):
        return result.fatal('CSV_ERROR_STRUCTURE');
      case step.row.errors.length > 0:
        return result.error('CSV_ERROR_STRUCTURE');
      case step.row.data[PERIOD] === '':
        return result.error('CSV_ERROR_EMPTY_PERIOD');
      case typeof step.row.data[POSITION] !== 'number':
        return result.error('CSV_ERROR_EMPTY_POSITION');
      case typeof step.row.data[VALUE] !== 'number':
        return result.error('CSV_ERROR_INVALID_VALUE');
      case !validateKvantumStatus(step.row.data[STATUS]):
        return result.error('CSV_ERROR_INVALID_STATUS');
      case !result.trySetPeriod(step.row.data[PERIOD]):
        return result.fatal('CSV_ERROR_INVALID_PERIOD');
    }

    return result.addMeasurement({
      position: step.row.data[POSITION],
      quantity: step.row.data[VALUE],
      quality: this.mapToSendMeasurementsQuality(step.row.data[STATUS]),
    });
  };

  parseFile = (file: File, resolution: SendMeasurementsResolution): Observable<MeasureDataResult> =>
    of(file).pipe(
      switchMap(this.detectEncoding),
      switchMap(this.streamCsv(file)),
      scan(this.aggregate, new MeasureDataResult(file.size, resolution))
    );
}
