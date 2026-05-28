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
import {
  toLocalCalendarDate,
  toUtcCalendarMidnight,
  toUtcEndOfDay,
  toUtcMidnight,
} from './watt-date-tz';

// The watt test suite pins TZ=Europe/Copenhagen (vitest.config.mts), which is always
// ahead of UTC. That makes the day-shift assertions below falsifiable: a regression to
// raw local-Date handling would produce a different instant than the UTC-anchored result.
describe('watt-date-tz', () => {
  describe('toUtcMidnight', () => {
    it('returns null for null input', () => {
      expect(toUtcMidnight(null)).toBeNull();
    });

    it('returns null for undefined input', () => {
      expect(toUtcMidnight(undefined)).toBeNull();
    });

    it('returns null for an invalid Date', () => {
      expect(toUtcMidnight(new Date('not-a-date'))).toBeNull();
    });

    it('produces UTC midnight for a local-time Date', () => {
      const local = new Date(2025, 0, 15, 14, 32, 7);
      const utc = toUtcMidnight(local);
      expect(utc).not.toBeNull();
      expect(utc?.toISOString()).toBe('2025-01-15T00:00:00.000Z');
    });

    it('preserves the local calendar day, not the UTC day', () => {
      // 23:00 local on Jan 15 may be Jan 16 in UTC depending on offset.
      // The result must still anchor on Jan 15.
      const local = new Date(2025, 0, 15, 23, 0, 0);
      const utc = toUtcMidnight(local);
      expect(utc?.getUTCDate()).toBe(15);
      expect(utc?.getUTCMonth()).toBe(0);
      expect(utc?.getUTCFullYear()).toBe(2025);
      expect(utc?.getUTCHours()).toBe(0);
    });

    it('uses the local calendar day across DST (summer, +02:00 offset)', () => {
      // 00:30 local on 1 July in Copenhagen (+02:00) is still 30 June 22:30 in UTC.
      // Raw local-to-UTC handling would shift to 30 June; the calendar day must stay 1 July.
      const localSummer = new Date(2025, 6, 1, 0, 30, 0);
      expect(toUtcMidnight(localSummer)?.toISOString()).toBe('2025-07-01T00:00:00.000Z');
    });
  });

  describe('toUtcEndOfDay', () => {
    it('returns null for null input', () => {
      expect(toUtcEndOfDay(null)).toBeNull();
    });

    it('produces UTC end-of-day for a local-time Date', () => {
      const local = new Date(2025, 0, 15, 9, 0, 0);
      const utc = toUtcEndOfDay(local);
      expect(utc).not.toBeNull();
      expect(utc?.toISOString()).toBe('2025-01-15T23:59:59.999Z');
    });

    it('preserves the local calendar day', () => {
      const local = new Date(2025, 0, 15, 23, 0, 0);
      const utc = toUtcEndOfDay(local);
      expect(utc?.getUTCDate()).toBe(15);
      expect(utc?.getUTCHours()).toBe(23);
      expect(utc?.getUTCMinutes()).toBe(59);
      expect(utc?.getUTCSeconds()).toBe(59);
      expect(utc?.getUTCMilliseconds()).toBe(999);
    });
  });

  describe('toLocalCalendarDate', () => {
    it('returns null for null input', () => {
      expect(toLocalCalendarDate(null)).toBeNull();
    });

    it('returns null for an invalid Date', () => {
      expect(toLocalCalendarDate(new Date('not-a-date'))).toBeNull();
    });

    it('returns a local-time Date with the same UTC calendar day', () => {
      const utc = new Date(Date.UTC(2025, 0, 15));
      const local = toLocalCalendarDate(utc);
      expect(local).not.toBeNull();
      expect(local?.getFullYear()).toBe(2025);
      expect(local?.getMonth()).toBe(0);
      expect(local?.getDate()).toBe(15);
    });

    it('accepts an ISO string', () => {
      const local = toLocalCalendarDate('2025-03-01T00:00:00.000Z');
      expect(local?.getFullYear()).toBe(2025);
      expect(local?.getMonth()).toBe(2);
      expect(local?.getDate()).toBe(1);
    });

    it('round-trips with toUtcMidnight on the same calendar day', () => {
      // Simulates the Material -> model -> Material trip: a user click in local
      // time, normalized to UTC midnight, then projected back for display.
      const original = new Date(2025, 5, 7);
      const roundTripped = toLocalCalendarDate(toUtcMidnight(original));
      expect(roundTripped?.getFullYear()).toBe(original.getFullYear());
      expect(roundTripped?.getMonth()).toBe(original.getMonth());
      expect(roundTripped?.getDate()).toBe(original.getDate());
    });
  });

  describe('toUtcCalendarMidnight', () => {
    it('returns null for null input', () => {
      expect(toUtcCalendarMidnight(null)).toBeNull();
    });

    it('returns null for an invalid Date', () => {
      expect(toUtcCalendarMidnight(new Date('not-a-date'))).toBeNull();
    });

    it('re-anchors a UTC end-of-day value to UTC midnight of the same UTC day', () => {
      const end = new Date('2025-01-20T23:59:59.999Z');
      expect(toUtcCalendarMidnight(end)?.toISOString()).toBe('2025-01-20T00:00:00.000Z');
    });

    it('accepts an ISO string', () => {
      expect(toUtcCalendarMidnight('2025-03-15T23:59:59.999Z')?.toISOString()).toBe(
        '2025-03-15T00:00:00.000Z'
      );
    });

    it('is a no-op for a value already at UTC midnight', () => {
      const midnight = new Date('2025-06-07T00:00:00.000Z');
      expect(toUtcCalendarMidnight(midnight)?.toISOString()).toBe('2025-06-07T00:00:00.000Z');
    });
  });
});
