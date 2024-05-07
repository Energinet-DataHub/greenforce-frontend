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
import { dhIsPeriodOneMonthOrLonger } from './dh-is-period-one-month-or-longer';

const _1stJaruaryStartOfDay = '2021-01-01T00:00:00+01:00';
const _14thJanuaryEndOfDay = '2021-01-14T23:59:59.999+01:00';
const _31stJanuaryEndOfDay = '2021-01-31T23:59:59.999+01:00';

const _14thFebruaryEndOfDay = '2021-02-14T23:59:59.999+01:00';

describe(dhIsPeriodOneMonthOrLonger, () => {
  it('should return `true` if the period is exactly one month', () => {
    const period = {
      start: _1stJaruaryStartOfDay,
      end: _31stJanuaryEndOfDay,
    };
    expect(dhIsPeriodOneMonthOrLonger(period)).toBeTruthy();
  });

  it('should return `true` if the period is longer than one month', () => {
    const period = {
      start: _1stJaruaryStartOfDay,
      end: _14thFebruaryEndOfDay,
    };
    expect(dhIsPeriodOneMonthOrLonger(period)).toBeTruthy();
  });

  it('should return `false` if the period is shorter than one month', () => {
    const period = {
      start: _1stJaruaryStartOfDay,
      end: _14thJanuaryEndOfDay,
    };
    expect(dhIsPeriodOneMonthOrLonger(period)).toBeFalsy();
  });
});
