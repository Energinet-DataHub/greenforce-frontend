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
import { WattDatePipe } from './watt-date.pipe';

describe(WattDatePipe, () => {
  const pipe = new WattDatePipe();

  it('transforms "2021-12-31T23:00:00Z" to "01-01-2022"', () => {
    expect(pipe.transform('2021-12-31T23:00:00Z')).toBe('01-01-2022');
  });

  it('transforms "2021-06-30T22:00:00Z" to "01-07-2021"', () => {
    expect(pipe.transform('2021-06-30T22:00:00Z')).toBe('01-07-2021');
  });

  it('transforms "2015-01-24T03:14:15Z" to "24-01-2015, 04:14"', () => {
    expect(pipe.transform('2015-01-24T03:14:15Z', 'long')).toBe('24-01-2015, 04:14');
  });

  it('transforms "2015-09-21T03:14:15Z" to "21-09-2015, 05:14"', () => {
    expect(pipe.transform('2015-09-21T03:14:15Z', 'long')).toBe('21-09-2015, 05:14');
  });

  it('transforms "2024-01-01T00:00Z" to "month year"', () => {
    expect(pipe.transform('2024-01-01T00:00Z', 'monthYear')).toBe('January 2024');
  });

  it('transforms date range in short format', () => {
    const range = { start: '2019-03-25T22:00:00Z', end: '2019-03-27T21:59:59Z' };
    expect(pipe.transform(range)).toBe('25-03-2019 ― 27-03-2019');
  });

  it('transforms date range with end null', () => {
    const range = { start: '2019-03-25T22:00:00Z', end: '9999-12-31T23:59:59Z' };
    expect(pipe.transform(range)).toBe('25-03-2019');
  });

  it('transforms date range in long format', () => {
    const range = { start: '2023-01-01T22:00:00Z', end: '2023-02-01T21:59:59Z' };
    expect(pipe.transform(range, 'long')).toBe('01-01-2023, 23:00 ― 01-02-2023, 22:59');
  });

  it('transforms invalid values to null', () => {
    expect(pipe.transform(null)).toBe(null);
    expect(pipe.transform(undefined)).toBe(null);
    expect(pipe.transform('')).toBe(null);
    expect(pipe.transform(null, 'long')).toBe(null);
    expect(pipe.transform(undefined, 'long')).toBe(null);
    expect(pipe.transform('', 'long')).toBe(null);
  });
});
