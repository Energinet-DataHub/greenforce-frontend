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
/* eslint-disable sonarjs/no-duplicate-string */
import { ChargeResolution } from '@energinet-datahub/dh/shared/domain/graphql';
import { parseChargeSeries } from '../src/parse-charge-series';
import { lastValueFrom } from 'rxjs';
import { ChargeSeriesResult } from '../src/charge-series-result';

const makeReadable = (result: ChargeSeriesResult) => ({
  interval: result.maybeGetDateRange(),
  errors: result.errors,
  isFatal: result.isFatal,
  points: result.points.length,
  progress: result.progress,
  resolution: result.resolution,
});

describe(parseChargeSeries, () => {
  it('should parse points in quarter hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,28.4.2025 0.00,2',
      '2,28.4.2025 0.15,2',
      '3,28.4.2025 0.30,2',
      '4,28.4.2025 0.45,2',
      '5,28.4.2025 1.00,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should parse points in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,28.4.2025 0.00,8',
      '2,28.4.2025 1.00,8',
      '3,28.4.2025 2.00,8',
      '4,28.4.2025 3.00,8',
      '5,28.4.2025 4.00,8',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should parse points in daily resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,28.4.2025 0.00,8',
      '2,29.4.2025 0.00,8',
      '3,30.4.2025 0.00,8',
      '4,01.5.2025 0.00,8',
      '5,02.5.2025 0.00,8',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Daily);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should parse points in monthly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,1.1.2025 0.00,100',
      '2,1.2.2025 0.00,100',
      '3,1.3.2025 0.00,100',
      '4,1.4.2025 0.00,100',
      '5,1.5.2025 0.00,100',
      '6,1.6.2025 0.00,100',
      '7,1.7.2025 0.00,100',
      '8,1.8.2025 0.00,100',
      '9,1.9.2025 0.00,100',
      '10,1.10.2025 0.00,100',
      '11,1.11.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should handle DST start correctly in quarter hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,30.3.2025 0.00,2',
      '2,30.3.2025 0.15,2',
      '3,30.3.2025 0.30,2',
      '4,30.3.2025 0.45,2',
      '5,30.3.2025 1.00,2',
      '6,30.3.2025 1.15,2',
      '7,30.3.2025 1.30,2',
      '8,30.3.2025 1.45,2',
      '9,30.3.2025 3.00,2',
      '10,30.3.2025 3.15,2',
      '11,30.3.2025 3.30,2',
      '12,30.3.2025 3.45,2',
      '13,30.3.2025 4.00,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should handle DST start correctly in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,30.3.2025 0.00,2',
      '2,30.3.2025 1.00,2',
      '3,30.3.2025 3.00,2',
      '4,30.3.2025 4.00,2',
      '5,30.3.2025 5.00,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should handle DST end correctly in quarter hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,26.10.2025 0.00,2',
      '2,26.10.2025 0.15,2',
      '3,26.10.2025 0.30,2',
      '4,26.10.2025 0.45,2',
      '5,26.10.2025 1.00,2',
      '6,26.10.2025 1.15,2',
      '7,26.10.2025 1.30,2',
      '8,26.10.2025 1.45,2',
      '9,26.10.2025 2.00,2',
      '10,26.10.2025 2.15,2',
      '11,26.10.2025 2.30,2',
      '12,26.10.2025 2.45,2',
      '13,26.10.2025 2.00,2',
      '14,26.10.2025 2.15,2',
      '15,26.10.2025 2.30,2',
      '16,26.10.2025 2.45,2',
      '17,26.10.2025 3.00,2',
      '18,26.10.2025 3.15,2',
      '19,26.10.2025 3.30,2',
      '20,26.10.2025 3.45,2',
      '21,26.10.2025 4.00,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should handle DST end correctly in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,26.10.2025 0.00,2',
      '2,26.10.2025 1.00,2',
      '3,26.10.2025 2.00,2',
      '4,26.10.2025 2.00,2',
      '5,26.10.2025 3.00,2',
      '6,26.10.2025 4.00,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with missing points in quarter hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,28.4.2025 0.00,2',
      '3,28.4.2025 0.30,2',
      '4,28.4.2025 0.45,2',
      '5,28.4.2025 1.00,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with unexpected points in quarter hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,28.4.2025 0.00,2',
      '2,28.4.2025 0.05,2',
      '3,28.4.2025 0.15,2',
      '4,28.4.2025 0.30,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with missing points in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,28.4.2025 0.00,8',
      '2,28.4.2025 2.00,8',
      '3,28.4.2025 3.00,8',
      '4,28.4.2025 4.00,8',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with unexpected points in hourly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,28.4.2025 0.00,8',
      '2,28.4.2025 0.15,8',
      '3,28.4.2025 2.00,8',
      '4,28.4.2025 3.00,8',
      '5,28.4.2025 4.00,8',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Hourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with missing points in daily resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,1.1.2025 0.00,100',
      '2,2.1.2025 0.00,100',
      '3,4.1.2025 0.00,100',
      '4,5.1.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Daily);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with unexpected points in daily resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,1.1.2025 0.00,100',
      '2,2.1.2025 0.00,100',
      '3,3.1.2025 0.00,100',
      '4,4.1.2025 0.00,100',
      '5,5.1.2025 0.00,100',
      '6,5.1.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Daily);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with missing points in monthly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,1.1.2025 0.00,100',
      '2,1.2.2025 0.00,100',
      '3,1.4.2025 0.00,100',
      '4,1.5.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error with unexpected points in monthly resolution', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,1.1.2025 0.00,100',
      '2,1.2.2025 0.00,100',
      '3,1.3.2025 0.00,100',
      '4,1.4.2025 0.00,100',
      '5,1.5.2025 0.00,100',
      '6,1.5.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error when structure is unexpected', async () => {
    const csv = [
      'Periode,Pris',
      '1.1.2025 0.00,100',
      '1.2.2025 0.00,100',
      '1.3.2025 0.00,100',
      '1.4.2025 0.00,100',
      '1.5.2025 0.00,100',
      '1.5.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error when period is invalid', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,26.10 0.00,2',
      '2,26.10 0.15,2',
      '3,26.10 0.30,2',
      '4,26.10 0.45,2',
      '5,26.10 1.00,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error when position is invalid', async () => {
    const csv = [
      'Position,Periode,Pris',
      'one,26.10.2025 0.00,2',
      '2,26.10.2025 0.15,2',
      '3,26.10.2025 0.30,2',
      '4,26.10.2025 0.45,2',
      '5,26.10.2025 1.00,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error when price is invalid', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,26.10.2025 0.00,null',
      '2,26.10.2025 0.15,2',
      '3,26.10.2025 0.30,2',
      '4,26.10.2025 0.45,2',
      '5,26.10.2025 1.00,2',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.QuarterHourly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should parse monthly resolution with first entry starting mid-month', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,15.1.2025 0.00,100',
      '2,1.2.2025 0.00,100',
      '3,1.3.2025 0.00,100',
      '4,1.4.2025 0.00,100',
      '5,1.5.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should parse monthly resolution with first entry on last day of month', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,31.1.2025 0.00,100',
      '2,1.2.2025 0.00,100',
      '3,1.3.2025 0.00,100',
      '4,1.4.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error when second entry in monthly resolution is not on first of month', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,15.1.2025 0.00,100',
      '2,15.2.2025 0.00,100',
      '3,1.3.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });

  it('should error when third entry in monthly resolution is not on first of month', async () => {
    const csv = [
      'Position,Periode,Pris',
      '1,15.1.2025 0.00,100',
      '2,1.2.2025 0.00,100',
      '3,15.3.2025 0.00,100',
    ].join('\n');

    const stream = parseChargeSeries(csv, ChargeResolution.Monthly);
    const result = await lastValueFrom(stream);
    expect(makeReadable(result)).toMatchSnapshot();
  });
});
