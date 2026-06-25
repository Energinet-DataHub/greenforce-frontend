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
import { FormControl } from '@angular/forms';
import { dayjs } from '@energinet/watt/date';

import {
  dhDateNotInThePastValidator,
  isDateBeforeToday,
} from '../src/dh-date-not-in-the-past.validator';

// Reference dates are built in the same timezone the validator compares in
// (Europe/Copenhagen), so the today/tomorrow boundaries stay stable regardless
// of the test runner's timezone (e.g. UTC in CI).
const danishStartOfToday = () => dayjs().tz('Europe/Copenhagen').startOf('day');

describe('isDateBeforeToday', () => {
  it('returns true for yesterday', () => {
    expect(isDateBeforeToday(danishStartOfToday().subtract(1, 'day').toDate())).toBe(true);
  });

  it('returns false for today', () => {
    expect(isDateBeforeToday(danishStartOfToday().toDate())).toBe(false);
  });

  it('returns false for tomorrow', () => {
    expect(isDateBeforeToday(danishStartOfToday().add(1, 'day').toDate())).toBe(false);
  });

  it('returns false for an empty value', () => {
    expect(isDateBeforeToday(null)).toBe(false);
  });
});

describe('dhDateNotInThePastValidator', () => {
  it('returns null for an empty control', () => {
    expect(dhDateNotInThePastValidator()(new FormControl(null))).toBeNull();
  });

  it('returns null for today', () => {
    expect(
      dhDateNotInThePastValidator()(new FormControl(danishStartOfToday().toDate()))
    ).toBeNull();
  });

  it('flags a past date with dateInThePast', () => {
    const control = new FormControl(danishStartOfToday().subtract(1, 'day').toDate());
    expect(dhDateNotInThePastValidator()(control)).toEqual({ dateInThePast: true });
  });
});
