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
import { effect, Injectable } from '@angular/core';
import { Observable, of, scan, switchMap, takeWhile } from 'rxjs';
import * as Papa from 'papaparse';
import chardet from 'chardet';

import {
  ElectricityMarketMeteringPointType,
  MeteringPointType2,
  SendMeasurementsDocument,
  SendMeasurementsQuality,
  SendMeasurementsResolution,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { MeasureDataResult } from './models/measure-data-result';
import { injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { assert, assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

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
export class DhUploadMeasurementsService {
  private toast = injectToast('meteringPoint.measurements.upload.toast');
  private sendMeasurements = mutation(SendMeasurementsDocument);
  protected toastEffect = effect(() => this.toast(this.sendMeasurements.status()));

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
  private mapQuality = (quality: string): SendMeasurementsQuality | null => {
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

  /** Maps metering point type to more narrow type.  */
  private mapMeteringPointType(type: ElectricityMarketMeteringPointType) {
    switch (type) {
      case ElectricityMarketMeteringPointType.Consumption:
        return MeteringPointType2.Consumption;
      case ElectricityMarketMeteringPointType.Production:
        return MeteringPointType2.Production;
      case ElectricityMarketMeteringPointType.Exchange:
        return MeteringPointType2.Exchange;
      case ElectricityMarketMeteringPointType.VeProduction:
        return MeteringPointType2.VeProduction;
      case ElectricityMarketMeteringPointType.Analysis:
        return MeteringPointType2.Analysis;
      default:
        throw new Error(`Unsupported metering point type: ${type}`);
    }
  }

  /** Maps resolution string to SendMeasurementsResolution. */
  private mapResolution(resolution: string): SendMeasurementsResolution {
    switch (resolution) {
      case 'PT15M':
        return SendMeasurementsResolution.QuarterHourly;
      case 'PT1H':
        return SendMeasurementsResolution.Hourly;
      case 'P1M':
        return SendMeasurementsResolution.Monthly;
      default:
        throw new Error(`Unsupported resolution: ${resolution}`);
    }
  }

  /** Type guard for CSV headers. Checks that all required columns are present. */
  private isMeasurementsCSV = (row: Record<string, unknown>): row is MeasurementsCSV =>
    [PERIOD, POSITION, QUALITY, QUANTITY].every((column) => column in row);

  /** Aggregate parsed CSV data into a MeasureDataResult. */
  private aggregate = (result: MeasureDataResult, step: ParseStep, index: number) => {
    if (step.kind === 'completed') return result.done();

    // Get the current end before setting period
    const currentEnd = result.maybeGetEnd();
    const quality = this.mapQuality(step.row.data[QUALITY]);
    result.updateProgress(step.row.meta.cursor);
    result.index = index; // track current row

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
  parseFile = (file: File, resolution: string): Observable<MeasureDataResult> =>
    of(file).pipe(
      switchMap(this.detectEncoding),
      switchMap(this.streamCsv(file)),
      scan(this.aggregate, new MeasureDataResult(file.size, this.mapResolution(resolution))),
      takeWhile((result) => !result.isFatal, true)
    );

  /** Sends measurements to the server. */
  send = (
    meteringPointId: string,
    meteringPointType: ElectricityMarketMeteringPointType,
    result: MeasureDataResult
  ) => {
    const interval = result.maybeGetDateRange();
    assertIsDefined(interval?.start);
    assertIsDefined(interval?.end);
    assert(!result.errors.length);
    this.sendMeasurements.mutate({
      variables: {
        input: {
          meteringPointId,
          meteringPointType: this.mapMeteringPointType(meteringPointType),
          resolution: result.resolution,
          start: interval.start,
          end: interval.end,
          measurements: result.measurements,
        },
      },
    });
  };
}
