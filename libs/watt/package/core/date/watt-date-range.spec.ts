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
import { contains, WattRange } from './watt-date-range';

describe(contains.name, () => {
  const closedRange: WattRange<Date> = {
    start: new Date('2024-03-01T00:00:00Z'),
    end: new Date('2024-06-30T00:00:00Z'),
  };

  const openRange: WattRange<Date> = {
    start: new Date('2024-03-01T00:00:00Z'),
    end: null,
  };

  it('returns true when date is within a closed range', () => {
    expect(contains(closedRange, new Date('2024-04-15T00:00:00Z'))).toBe(true);
  });

  it('returns true when date equals the start of the range', () => {
    expect(contains(closedRange, new Date('2024-03-01T00:00:00Z'))).toBe(true);
  });

  it('returns true when date equals the end of the range', () => {
    expect(contains(closedRange, new Date('2024-06-30T00:00:00Z'))).toBe(true);
  });

  it('returns false when date is before the start of the range', () => {
    expect(contains(closedRange, new Date('2024-02-28T00:00:00Z'))).toBe(false);
  });

  it('returns false when date is after the end of the range', () => {
    expect(contains(closedRange, new Date('2024-07-01T00:00:00Z'))).toBe(false);
  });

  it('returns true when date is after the start of an open-ended range', () => {
    expect(contains(openRange, new Date('2099-12-31T00:00:00Z'))).toBe(true);
  });

  it('returns true when date equals the start of an open-ended range', () => {
    expect(contains(openRange, new Date('2024-03-01T00:00:00Z'))).toBe(true);
  });

  it('returns false when date is before the start of an open-ended range', () => {
    expect(contains(openRange, new Date('2024-02-28T00:00:00Z'))).toBe(false);
  });
});
