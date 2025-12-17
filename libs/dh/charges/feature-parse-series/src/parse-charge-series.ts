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
import { Observable, of, scan, switchMap, takeWhile } from 'rxjs';
import * as Papa from 'papaparse';
import chardet from 'chardet';
import { ChargeResolution } from '@energinet-datahub/dh/shared/domain/graphql';
import { ChargeSeriesResult } from './charge-series-result';

// Column names
const PERIOD = 'Periode';
const POSITION = 'Position';
const PRICE = 'Pris';

// Type for a row in the charge series CSV
export type ChargeSeriesCSV = {
  [PERIOD]: string;
  [POSITION]: number | unknown;
  [PRICE]: number | unknown;
};

type ParseStep =
  | { kind: 'completed' }
  | { kind: 'step'; row: Papa.ParseStepResult<Record<string, string>> };

/** Try to detect the encoding of the file, falling back to `utf-8`. */
const detectEncoding = async (file: File) =>
  chardet.detect(new Uint8Array(await file.slice(0, 1000).arrayBuffer())) ?? 'utf-8';

/** Stream the CSV file as a sequence of rows. */
const streamCsv = (source: File | string) => (encoding: string) =>
  new Observable<ParseStep>((observer) => {
    let teardown = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    Papa.parse<Record<string, string>>(source, {
      encoding,
      skipEmptyLines: true,
      chunkSize: 10_000,
      header: true,
      transform: (row, header) => (header === PRICE ? row.replace(',', '.') : row).trim(),
      dynamicTyping: {
        [POSITION]: true,
        [PRICE]: true,
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

/** Type guard for CSV headers. Checks that all required columns are present. */
const isChargeSeriesCSV = (row: Record<string, unknown>): row is ChargeSeriesCSV =>
  [PERIOD, POSITION, PRICE].every((column) => column in row);

/** Aggregate parsed CSV data into a ChargeSeriesResult. */
const aggregate = (result: ChargeSeriesResult, step: ParseStep, index: number) => {
  if (step.kind === 'completed') return result.done();

  // Get the current end before setting period
  const currentEnd = result.maybeGetEnd();
  result.updateProgress(step.row.meta.cursor);
  result.index = index; // track current row

  // Error handling
  if (!isChargeSeriesCSV(step.row.data)) return result.fatal('STRUCTURE');
  if (step.row.errors.length > 0) return result.fatal('UNKNOWN');
  if (!result.trySetPeriod(step.row.data[PERIOD])) return result.fatal('INVALID_PERIOD');
  if (typeof step.row.data[POSITION] !== 'number') return result.error('INVALID_POSITION');
  if (typeof step.row.data[PRICE] !== 'number') return result.error('INVALID_PRICE');
  if (currentEnd?.isBefore(result.last)) return result.fatal('MISSING_POINT');
  if (currentEnd?.isAfter(result.last)) return result.fatal('UNEXPECTED_POINT');

  return result.addPoint({
    position: step.row.data[POSITION],
    priceAmount: step.row.data[PRICE],
  });
};

/** Parse charge series, streaming the result. */
export const parseChargeSeries = (source: File | string, resolution: ChargeResolution) => {
  const size = typeof source === 'string' ? source.length : source.size;
  return of(source).pipe(
    switchMap((source) => (typeof source === 'string' ? of('UTF-8') : detectEncoding(source))),
    switchMap(streamCsv(source)),
    scan(aggregate, new ChargeSeriesResult(size, resolution)),
    takeWhile((result) => !result.isFatal, true)
  );
};
