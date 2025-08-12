/* eslint-disable sonarjs/no-duplicate-string */
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
import { SendMeasurementsResolution } from '@energinet-datahub/dh/shared/domain/graphql';
import { parseMeasurements } from '../src/parse-measurements';
import { lastValueFrom } from 'rxjs';
import { MeasureDataResult } from '../src/models/measure-data-result';

const makeReadable = (result: MeasureDataResult) => ({
  interval: result.maybeGetDateRange(),
  errors: result.errors,
  isFatal: result.isFatal,
  measurements: result.measurements.length,
  progress: result.progress,
  qualities: [...result.qualities].join('/'),
  resolution: result.resolution,
  sum: result.sum,
});

describe(parseMeasurements, () => {
  it('should parse measurements in quarter hourly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,28.4.2025 0.00,2,Målt',
      '2,28.4.2025 0.15,2,Målt',
      '3,28.4.2025 0.30,2,Målt',
      '4,28.4.2025 0.45,2,Målt',
      '5,28.4.2025 1.00,2,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should parse measurements in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,28.4.2025 0.00,8,Målt',
      '2,28.4.2025 1.00,8,Målt',
      '3,28.4.2025 2.00,8,Målt',
      '4,28.4.2025 3.00,8,Målt',
      '5,28.4.2025 4.00,8,Estimeret',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should parse measurements in monthly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,1.1.2025 0.00,100,Estimeret',
      '2,1.2.2025 0.00,100,Målt',
      '3,1.3.2025 0.00,100,Målt',
      '4,1.4.2025 0.00,100,Målt',
      '5,1.5.2025 0.00,100,Målt',
      '6,1.6.2025 0.00,100,Målt',
      '7,1.7.2025 0.00,100,Målt',
      '8,1.8.2025 0.00,100,Målt',
      '9,1.9.2025 0.00,100,Målt',
      '10,1.10.2025 0.00,100,Målt',
      '11,1.11.2025 0.00,100,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should handle DST start correctly in quarter hourly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,30.3.2025 0.00,2,Målt',
      '2,30.3.2025 0.15,2,Målt',
      '3,30.3.2025 0.30,2,Målt',
      '4,30.3.2025 0.45,2,Målt',
      '5,30.3.2025 1.00,2,Målt',
      '6,30.3.2025 1.15,2,Estimeret',
      '7,30.3.2025 1.30,2,Målt',
      '8,30.3.2025 1.45,2,Målt',
      '9,30.3.2025 3.00,2,Målt',
      '10,30.3.2025 3.15,2,Målt',
      '11,30.3.2025 3.30,2,Målt',
      '12,30.3.2025 3.45,2,Målt',
      '13,30.3.2025 4.00,2,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should handle DST start correctly in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,30.3.2025 0.00,2,Målt',
      '2,30.3.2025 1.00,2,Målt',
      '3,30.3.2025 3.00,2,Målt',
      '4,30.3.2025 4.00,2,Målt',
      '5,30.3.2025 5.00,2,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should handle DST end correctly in quarter hourly resolution', async () => {
    // we might have a problem if running the parser on computers that are not using
    // the danish timezone, due to DST...
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,26.10.2025 0.00,2,Målt',
      '2,26.10.2025 0.15,2,Målt',
      '3,26.10.2025 0.30,2,Målt',
      '4,26.10.2025 0.45,2,Målt',
      '5,26.10.2025 1.00,2,Målt',
      '6,26.10.2025 1.15,2,Estimeret',
      '7,26.10.2025 1.30,2,Målt',
      '8,26.10.2025 1.45,2,Målt',
      '9,26.10.2025 2.00,2,Målt',
      '10,26.10.2025 2.15,2,Målt',
      '11,26.10.2025 2.30,2,Målt',
      '12,26.10.2025 2.45,2,Målt',
      '13,26.10.2025 2.00,2,Målt',
      '14,26.10.2025 2.15,2,Målt',
      '15,26.10.2025 2.30,2,Målt',
      '16,26.10.2025 2.45,2,Målt',
      '17,26.10.2025 3.00,2,Målt',
      '18,26.10.2025 3.15,2,Målt',
      '19,26.10.2025 3.30,2,Målt',
      '20,26.10.2025 3.45,2,Målt',
      '21,26.10.2025 4.00,2,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should handle DST end correctly in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,26.10.2025 0.00,2,Målt',
      '2,26.10.2025 1.00,2,Målt',
      '3,26.10.2025 2.00,2,Målt',
      '4,26.10.2025 2.00,2,Målt',
      '5,26.10.2025 3.00,2,Målt',
      '6,26.10.2025 4.00,2,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with missing measurements in quarter hourly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,28.4.2025 0.00,2,Målt',
      '3,28.4.2025 0.30,2,Målt',
      '4,28.4.2025 0.45,2,Målt',
      '5,28.4.2025 1.00,2,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with unexpected measurements in quarter hourly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,28.4.2025 0.00,2,Målt',
      '2,28.4.2025 0.05,2,Målt',
      '3,28.4.2025 0.15,2,Målt',
      '4,28.4.2025 0.30,2,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with missing measurements in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,28.4.2025 0.00,8,Målt',
      '2,28.4.2025 2.00,8,Målt',
      '3,28.4.2025 3.00,8,Målt',
      '4,28.4.2025 4.00,8,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with unexpected measurements in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,28.4.2025 0.00,8,Målt',
      '2,28.4.2025 0.15,8,Målt',
      '3,28.4.2025 2.00,8,Målt',
      '4,28.4.2025 3.00,8,Målt',
      '5,28.4.2025 4.00,8,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with missing measurements in monthly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,1.1.2025 0.00,100,Estimeret',
      '2,1.2.2025 0.00,100,Målt',
      '3,1.4.2025 0.00,100,Målt',
      '4,1.5.2025 0.00,100,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with unexpected measurements in monthly resolution', async () => {
    const csv = [
      'Position,Periode,Værdi,Kvantum status',
      '1,1.1.2025 0.00,100,Estimeret',
      '2,1.2.2025 0.00,100,Målt',
      '3,1.3.2025 0.00,100,Målt',
      '4,1.4.2025 0.00,100,Målt',
      '5,1.5.2025 0.00,100,Målt',
      '6,1.5.2025 0.00,100,Målt',
    ].join('\n');

    const stream = parseMeasurements(csv, SendMeasurementsResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });
});

// case 'PT15M':
//   return SendMeasurementsResolution.QuarterHourly;
// case 'PT1H':
//   return SendMeasurementsResolution.Hourly;
// case 'P1M':
