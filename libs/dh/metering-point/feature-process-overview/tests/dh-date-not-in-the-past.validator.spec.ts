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
import { dayjs } from '@energinet/watt/date';

import { isDateBeforeToday } from '../src/validators/dh-date-not-in-the-past.validator';

// Locks the shared day-comparison that both the calendar `dateFilter` and the
// `dhDateNotInThePastValidator` depend on, so the two can never drift.
describe('isDateBeforeToday', () => {
  it('returns true for yesterday', () => {
    expect(isDateBeforeToday(dayjs().startOf('day').subtract(1, 'day').toDate())).toBe(true);
  });

  it('returns false for today', () => {
    expect(isDateBeforeToday(dayjs().startOf('day').toDate())).toBe(false);
  });

  it('returns false for tomorrow', () => {
    expect(isDateBeforeToday(dayjs().startOf('day').add(1, 'day').toDate())).toBe(false);
  });

  it('returns false for an empty value', () => {
    expect(isDateBeforeToday(null)).toBe(false);
  });
});
