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

import {
  SendMeasurementsQuality,
  SendMeasurementsResolution,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { MeasureDataResult } from './measure-data-result';

// Column names
const PERIOD = 'Periode';
const POSITION = 'Position';
const QUALITY = 'Kvantum status';
const QUANTITY = 'Værdi';

// Type for a row in the measurements CSV
export type MeasurementsCSV = {
  [PERIOD]: string;
  [POSITION]: number | unknown;
  [QUALITY]: string;
  [QUANTITY]: number | unknown;
};

type ParseStep =
  | { kind: 'completed' }
  | { kind: 'step'; row: Papa.ParseStepResult<Record<string, string>> };

@Injectable({ providedIn: 'root' })
export class CsvParseService {
  /** Try to detect the encoding of the file, falling back to `utf-8`. */
  private detectEncoding = async (file: File) =>
    chardet.detect(new Uint8Array(await file.slice(0, 1000).arrayBuffer())) ?? 'utf-8';

  /** Stream the CSV file as a sequence of rows. */
  private streamCsv = (file: File) => (encoding: string) =>
    new Observable<ParseStep>((observer) => {
      let teardown = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
      Papa.parse<Record<string, string>>(file, {
        encoding,
        skipEmptyLines: true,
        chunkSize: 10_000,
        header: true,
        transform: (row, header) => (header === QUANTITY ? row.replace(',', '.') : row).trim(),
        dynamicTyping: {
          [POSITION]: true,
          [QUANTITY]: true,
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

  /** Maps CSV quality to `SendMeasurementsQuality` enum. */
  private mapToSendMeasurementsQuality = (quality: string): SendMeasurementsQuality | null => {
    switch (quality) {
      case 'A03':
      case 'M��lt': // Fix chunk splitting error: https://github.com/mholt/PapaParse/pull/1099
      case 'Målt':
        return SendMeasurementsQuality.Measured;
      case 'A04':
      case 'Estimeret':
        return SendMeasurementsQuality.Estimated;
      default:
        return null;
    }
  };

  /** Type guard for CSV headers. Checks that all required columns are present. */
  private isMeasurementsCSV = (row: Record<string, unknown>): row is MeasurementsCSV =>
    [PERIOD, POSITION, QUALITY, QUANTITY].every((column) => column in row);

  /** Aggregate parsed CSV data into a MeasureDataResult. */
  private aggregate = (result: MeasureDataResult, step: ParseStep, index: number) => {
    if (step.kind === 'completed') return result.done();

    // Get the current end before setting period
    const currentEnd = result.maybeGetEnd();
    const quality = this.mapToSendMeasurementsQuality(step.row.data[QUALITY]);
    result.updateProgress(step.row.meta.cursor);
    result.index = index;

    // Error handling
    if (!this.isMeasurementsCSV(step.row.data)) return result.fatal('STRUCTURE');
    if (step.row.errors.length > 0) return result.fatal('UNKNOWN');
    if (step.row.data[PERIOD] === '') return result.fatal('EMPTY_PERIOD');
    if (!result.trySetPeriod(step.row.data[PERIOD])) return result.fatal('INVALID_PERIOD');
    if (typeof step.row.data[POSITION] !== 'number') return result.error('EMPTY_POSITION');
    if (typeof step.row.data[QUANTITY] !== 'number') return result.error('INVALID_QUANTITY');
    if (quality === null) return result.error('INVALID_QUALITY');
    if (currentEnd?.isBefore(result.last)) return result.error('MISSING_MEASUREMENT');
    if (currentEnd?.isAfter(result.last)) return result.error('UNEXPECTED_MEASUREMENT');

    return result.addMeasurement({
      position: step.row.data[POSITION],
      quantity: step.row.data[QUANTITY],
      quality,
    });
  };

  /** Parses a CSV file of measurement data, streaming the result. */
  parseFile = (file: File, resolution: SendMeasurementsResolution): Observable<MeasureDataResult> =>
    of(file).pipe(
      switchMap(this.detectEncoding),
      switchMap(this.streamCsv(file)),
      scan(this.aggregate, new MeasureDataResult(file.size, resolution))
    );
}
